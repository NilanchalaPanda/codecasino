import { GameDifficulty, LeetCodeProblem, LeetCodeSubmission } from "../types";
import { LEETCODE_CONFIG, ANTI_CHEAT } from "../utils/constants";

// ============================================
// LEETCODE GRAPHQL QUERIES
// ============================================

const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        reputation
        realName
        userAvatar
        countryName
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

const RECENT_SUBMISSIONS_QUERY = `
  query getRecentSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      runtime
      memory
    }
  }
`;

const PROBLEM_DETAILS_QUERY = `
  query getProblemDetails($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      titleSlug
      difficulty
      content
      topicTags {
        name
        slug
      }
      hints
      stats
    }
  }
`;

// ============================================
// LEETCODE SERVICE CLASS
// ============================================

class LeetCodeService {
  private baseUrl = LEETCODE_CONFIG.GRAPHQL_ENDPOINT;
  private problemsCache: Map<string, LeetCodeProblem> = new Map();
  private lastFetchTime: number = 0;
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Make GraphQL request to LeetCode
   */
  private async graphqlRequest<T>(
    query: string,
    variables: Record<string, any>
  ): Promise<T> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com",
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`);
      }

      return data.data as T;
    } catch (error) {
      console.error("LeetCode API request failed:", error);
      throw error;
    }
  }

  /**
   * Verify and fetch user profile from LeetCode
   */
  async verifyUser(username: string): Promise<{
    isValid: boolean;
    rating: number;
    totalSolved: number;
    avatar?: string;
    error?: string; // Added error handling
  }> {
    try {
      const data = await this.graphqlRequest<any>(USER_PROFILE_QUERY, {
        username,
      });

      if (!data.matchedUser) {
        return {
          isValid: false,
          rating: 0,
          totalSolved: 0,
          error: "User not found on LeetCode",
        };
      }

      const user = data.matchedUser;
      const totalSolved = user.submitStats.acSubmissionNum.reduce(
        (sum: number, stat: any) => sum + stat.count,
        0
      );

      return {
        isValid: true,
        rating: user.profile.ranking || 0,
        totalSolved,
        avatar: user.profile.userAvatar,
      };
    } catch (error) {
      console.error("LeetCode verification failed:", error);

      let message = "Unknown error during verification";
      if (error instanceof Error) {
        message = error.message;
      }

      return { isValid: false, rating: 0, totalSolved: 0, error: message };
    }
  }

  /**
   * Get recent submissions for a user
   */
  async getRecentSubmissions(
    username: string,
    limit: number = 20
  ): Promise<LeetCodeSubmission[]> {
    try {
      const data = await this.graphqlRequest<any>(RECENT_SUBMISSIONS_QUERY, {
        username,
        limit,
      });

      if (!data.recentAcSubmissionList) {
        return [];
      }

      return data.recentAcSubmissionList.map((sub: any) => ({
        id: sub.id,
        timestamp: parseInt(sub.timestamp) * 1000, // Convert to ms
        statusDisplay: sub.statusDisplay,
        lang: sub.lang,
        runtime: sub.runtime,
        memory: sub.memory,
        title: sub.title,
        titleSlug: sub.titleSlug,
      }));
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      return [];
    }
  }

  /**
   * Verify if user solved a specific problem within time window
   */
  async verifySubmission(
    username: string,
    problemSlug: string,
    gameStartTime: Date,
    gameEndTime: Date
  ): Promise<{
    isValid: boolean;
    submission?: LeetCodeSubmission;
    reason?: string;
  }> {
    try {
      const submissions = await this.getRecentSubmissions(username, 50);

      // Find submission matching the problem
      const matchingSubmission = submissions.find(
        (sub) =>
          sub.titleSlug === problemSlug && sub.statusDisplay === "Accepted"
      );

      if (!matchingSubmission) {
        return {
          isValid: false,
          reason: "No accepted submission found for this problem",
        };
      }

      const subTime = new Date(matchingSubmission.timestamp);

      // Check if submission is within game time window
      if (subTime < gameStartTime || subTime > gameEndTime) {
        return {
          isValid: false,
          reason: "Submission timestamp outside game window",
        };
      }

      // Anti-cheat: Check if solve time is suspiciously fast
      const solveTime = (subTime.getTime() - gameStartTime.getTime()) / 1000; // seconds
      const minSolveTime = ANTI_CHEAT.MIN_SOLVE_TIME[GameDifficulty.EASY]; // Will be dynamic based on actual difficulty

      if (solveTime < minSolveTime) {
        console.warn(
          `Suspiciously fast solve time: ${solveTime}s for ${username}`
        );
        // Don't invalidate, but flag for review
      }

      return {
        isValid: true,
        submission: matchingSubmission,
      };
    } catch (error) {
      console.error("Submission verification failed:", error);
      return {
        isValid: false,
        reason: "Verification failed due to API error",
      };
    }
  }

  /**
   * Get problem details
   */
  async getProblemDetails(slug: string): Promise<LeetCodeProblem | null> {
    try {
      const data = await this.graphqlRequest<any>(PROBLEM_DETAILS_QUERY, {
        titleSlug: slug,
      });

      if (!data.question) {
        return null;
      }

      const q = data.question;
      return {
        problemId: q.questionId,
        title: q.title,
        slug: q.titleSlug,
        difficulty: q.difficulty.toLowerCase() as GameDifficulty,
        timeLimit: 0, // Will be set by game logic
        topics: q.topicTags.map((t: any) => t.name),
      };
    } catch (error) {
      console.error("Failed to fetch problem details:", error);
      return null;
    }
  }

  /**
   * Fetch all problems from LeetCode (for problem assignment)
   * Note: This uses the public problems API
   */
  async getAllProblems(): Promise<LeetCodeProblem[]> {
    // Check cache first
    const now = Date.now();
    if (
      this.problemsCache.size > 0 &&
      now - this.lastFetchTime < this.cacheExpiry
    ) {
      return Array.from(this.problemsCache.values());
    }

    try {
      const response = await fetch(LEETCODE_CONFIG.PROBLEMS_API);
      const data = await response.json();

      const problems: LeetCodeProblem[] = data.stat_status_pairs
        .filter((p: any) => !p.paid_only) // Filter out premium problems
        .map((p: any) => ({
          problemId: p.stat.question_id.toString(),
          title: p.stat.question__title,
          slug: p.stat.question__title_slug,
          difficulty: this.mapDifficulty(p.difficulty.level),
          timeLimit: 0,
          acceptanceRate: p.stat.total_acs / p.stat.total_submitted,
        }));

      // Update cache
      this.problemsCache.clear();
      problems.forEach((p) => this.problemsCache.set(p.problemId, p));
      this.lastFetchTime = now;

      return problems;
    } catch (error) {
      console.error("Failed to fetch all problems:", error);
      return [];
    }
  }

  /**
   * Get random problems based on difficulty
   */
  async getRandomProblems(
    difficulty: GameDifficulty,
    count: number
  ): Promise<LeetCodeProblem[]> {
    const allProblems = await this.getAllProblems();
    const filtered = allProblems.filter((p) => p.difficulty === difficulty);

    // Shuffle and pick
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Map LeetCode difficulty level to our enum
   */
  private mapDifficulty(level: number): GameDifficulty {
    switch (level) {
      case 1:
        return GameDifficulty.EASY;
      case 2:
        return GameDifficulty.MEDIUM;
      case 3:
        return GameDifficulty.HARD;
      default:
        return GameDifficulty.EASY;
    }
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache() {
    this.problemsCache.clear();
    this.lastFetchTime = 0;
  }
}

// Singleton instance
export const leetCodeService = new LeetCodeService();

// Export for testing
export { LeetCodeService };
