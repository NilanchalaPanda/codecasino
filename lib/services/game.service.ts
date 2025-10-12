import { supabaseAdmin } from "../supabase/server";
import {
  GameParticipant,
  ProblemSubmission,
  GameState,
  ParticipantStatus,
} from "../types";
import { ERROR_MESSAGES } from "../utils/constants";
import { leetCodeService } from "./leetcode.service";
import { poolService } from "./pool.service";
import { antiCheatService } from "./anti-cheat.service";

class GameService {
  /**
   * Submit a problem solution
   */
  async submitProblem(
    userId: string,
    poolId: string,
    problemId: string,
    timeTaken: number,
    leetcodeSubmissionId?: string
  ): Promise<{ success: boolean; error?: string }> {
    // Get pool and participant
    const pool = await poolService.getPool(poolId);
    const participant = await poolService.getParticipant(poolId, userId);

    if (!pool) {
      return { success: false, error: ERROR_MESSAGES.POOL_NOT_FOUND };
    }

    if (!participant) {
      return { success: false, error: "Not a participant in this pool" };
    }

    if (pool.status !== "active") {
      return { success: false, error: ERROR_MESSAGES.GAME_NOT_STARTED };
    }

    // Check if problem is assigned to this user
    const problemAssigned = participant.problems_assigned.find(
      (p: any) => p.problemId === problemId
    );

    if (!problemAssigned) {
      return { success: false, error: "Problem not assigned to you" };
    }

    // Check if already solved
    const existingSubmission = await this.getSubmission(
      participant.id,
      problemId
    );
    if (existingSubmission?.is_accepted) {
      return { success: false, error: ERROR_MESSAGES.PROBLEM_ALREADY_SOLVED };
    }

    // Check time limit
    if (timeTaken > problemAssigned.timeLimit) {
      return { success: false, error: ERROR_MESSAGES.TIME_LIMIT_EXCEEDED };
    }

    // Verify submission on LeetCode
    const gameStart = new Date(pool.actual_start!);
    const gameEnd = new Date(pool.end_time!);

    const verification = await leetCodeService.verifySubmission(
      participant.user_id,
      problemAssigned.slug,
      gameStart,
      gameEnd
    );

    if (!verification.isValid) {
      return {
        success: false,
        error: verification.reason || ERROR_MESSAGES.INVALID_SUBMISSION,
      };
    }

    // Run anti-cheat checks
    const antiCheatResult = await antiCheatService.checkSubmission(
      userId,
      poolId,
      problemId,
      timeTaken,
      verification.submission!
    );

    // Record submission
    const { data: submission, error } = await supabaseAdmin
      .from("problem_submissions")
      .insert({
        participant_id: participant.id,
        pool_id: poolId,
        user_id: userId,
        problem_id: problemId,
        problem_slug: problemAssigned.slug,
        leetcode_submission_id: leetcodeSubmissionId,
        leetcode_submission_time: verification.submission?.timestamp
          ? new Date(verification.submission.timestamp).toISOString()
          : null,
        is_accepted: true,
        verified_at: new Date().toISOString(),
        verification_method: "api",
        time_taken: timeTaken,
        within_time_limit: timeTaken <= problemAssigned.timeLimit,
        is_suspicious: !antiCheatResult.isPassed,
        suspicion_reasons: antiCheatResult.flags,
      })
      .select()
      .single();

    if (error) {
      console.error("Error recording submission:", error);
      return { success: false, error: "Failed to record submission" };
    }

    // Update participant stats
    const newProblemsSolved = participant.problems_solved + 1;
    const newTotalTime = participant.total_time_taken + timeTaken;

    const updates: any = {
      problems_solved: newProblemsSolved,
      problems_attempted: participant.problems_attempted + 1,
      total_time_taken: newTotalTime,
    };

    // Check if all problems completed
    if (newProblemsSolved === participant.problems_assigned.length) {
      updates.completion_time = newTotalTime;
      updates.finished_at = new Date().toISOString();
      updates.is_active = false;
    }

    // Add submission timestamp
    const submissionTimestamps = [
      ...(participant.submission_timestamps || []),
      {
        problemId,
        submittedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
      },
    ];
    updates.submission_timestamps = submissionTimestamps;

    await supabaseAdmin
      .from("game_participants")
      .update(updates)
      .eq("id", participant.id);

    return { success: true };
  }

  /**
   * Get game state for real-time updates
   */
  async getGameState(poolId: string): Promise<GameState | null> {
    const pool = await poolService.getPool(poolId);

    if (!pool) {
      return null;
    }

    const participants = await poolService.getPoolParticipants(poolId);

    // Calculate time remaining
    let timeRemaining = 0;
    if (pool.end_time && pool.status === "active") {
      const now = new Date();
      const end = new Date(pool.end_time);
      timeRemaining = Math.max(
        0,
        Math.floor((end.getTime() - now.getTime()) / 1000)
      );
    }

    // Build leaderboard
    const leaderboard: ParticipantStatus[] = await Promise.all(
      participants.map(async (p) => {
        const profile = await supabaseAdmin
          .from("profiles")
          .select("display_name")
          .eq("id", p.user_id)
          .single();

        return {
          userId: p.user_id,
          displayName: profile.data?.display_name || "Anonymous",
          problemsSolved: p.problems_solved,
          totalProblems: p.problems_assigned.length,
          timeTaken: p.total_time_taken,
          rank: p.rank,
          isFinished: !!p.finished_at,
        };
      })
    );

    // Sort leaderboard
    leaderboard.sort((a, b) => {
      if (b.problemsSolved !== a.problemsSolved) {
        return b.problemsSolved - a.problemsSolved;
      }
      return a.timeTaken - b.timeTaken;
    });

    return {
      poolId: pool.id,
      status: pool.status,
      participants,
      startTime: pool.actual_start,
      endTime: pool.end_time,
      timeRemaining,
      leaderboard,
    };
  }

  /**
   * Get submission record
   */
  async getSubmission(
    participantId: string,
    problemId: string
  ): Promise<ProblemSubmission | null> {
    const { data, error } = await supabaseAdmin
      .from("problem_submissions")
      .select("*")
      .eq("participant_id", participantId)
      .eq("problem_id", problemId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Get all submissions for a participant
   */
  async getParticipantSubmissions(
    participantId: string
  ): Promise<ProblemSubmission[]> {
    const { data, error } = await supabaseAdmin
      .from("problem_submissions")
      .select("*")
      .eq("participant_id", participantId)
      .order("submitted_at", { ascending: true });

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Get participant's current progress
   */
  async getParticipantProgress(
    poolId: string,
    userId: string
  ): Promise<{
    problemsSolved: number;
    totalProblems: number;
    timeElapsed: number;
    problems: Array<{
      problemId: string;
      title: string;
      difficulty: string;
      slug: string;
      solved: boolean;
      timeTaken?: number;
    }>;
  } | null> {
    const participant = await poolService.getParticipant(poolId, userId);

    if (!participant) {
      return null;
    }

    const submissions = await this.getParticipantSubmissions(participant.id);

    const problems = participant.problems_assigned.map((p: any) => {
      const submission = submissions.find((s) => s.problem_id === p.problemId);
      return {
        problemId: p.problemId,
        title: p.title,
        difficulty: p.difficulty,
        slug: p.slug,
        solved: !!submission?.is_accepted,
        timeTaken: submission?.time_taken,
      };
    });

    return {
      problemsSolved: participant.problems_solved,
      totalProblems: participant.problems_assigned.length,
      timeElapsed: participant.total_time_taken,
      problems,
    };
  }

  /**
   * Force end game for a participant (disconnect, quit, etc.)
   */
  async endParticipantGame(
    poolId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    const participant = await poolService.getParticipant(poolId, userId);

    if (!participant) {
      return { success: false, error: "Not a participant" };
    }

    await supabaseAdmin
      .from("game_participants")
      .update({
        is_active: false,
        finished_at: new Date().toISOString(),
      })
      .eq("id", participant.id);

    return { success: true };
  }

  /**
   * Get top performers in a completed game
   */
  async getGameResults(poolId: string): Promise<{
    winners: Array<{
      userId: string;
      displayName: string;
      rank: number;
      problemsSolved: number;
      timeTaken: number;
      prizeWon: number;
    }>;
    totalParticipants: number;
    totalPrize: number;
  } | null> {
    const pool = await poolService.getPool(poolId);

    if (!pool || pool.status !== "completed") {
      return null;
    }

    const participants = await poolService.getPoolParticipants(poolId);

    const winners = await Promise.all(
      participants
        .filter((p) => p.rank && p.rank <= 3)
        .map(async (p) => {
          const profile = await supabaseAdmin
            .from("profiles")
            .select("display_name")
            .eq("id", p.user_id)
            .single();

          return {
            userId: p.user_id,
            displayName: profile.data?.display_name || "Anonymous",
            rank: p.rank!,
            problemsSolved: p.problems_solved,
            timeTaken: p.total_time_taken,
            prizeWon: p.prize_won,
          };
        })
    );

    return {
      winners,
      totalParticipants: participants.length,
      totalPrize: pool.total_prize_pool,
    };
  }

  /**
   * Check if user can still submit (time not expired)
   */
  async canSubmit(poolId: string, userId: string): Promise<boolean> {
    const pool = await poolService.getPool(poolId);
    const participant = await poolService.getParticipant(poolId, userId);

    if (!pool || !participant) {
      return false;
    }

    if (pool.status !== "active") {
      return false;
    }

    if (!participant.is_active) {
      return false;
    }

    // Check if time has expired
    if (pool.end_time) {
      const now = new Date();
      const end = new Date(pool.end_time);
      if (now > end) {
        return false;
      }
    }

    return true;
  }
}

// Singleton instance
export const gameService = new GameService();

// Export for testing
export { GameService };
