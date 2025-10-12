import { supabaseAdmin } from "../supabase/server";
import { Profile, VPTransaction, TransactionType } from "../types";
import { VP_CONFIG, TIER_POINTS_PER_WIN } from "../utils/constants";
import { log, LogLevel } from "../utils/logger";
import { leetCodeService } from "./leetcode.service";

class UserService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  }

  /**
   * Create profile for new user
   */
  async createProfile(userId: string, email: string): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        email,
        vp_balance: VP_CONFIG.INITIAL_BALANCE,
        vp_lifetime_earned: VP_CONFIG.INITIAL_BALANCE,
        display_name: email.split("@")[0],
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    // Record initial VP transaction
    await this.recordVPTransaction(
      userId,
      VP_CONFIG.INITIAL_BALANCE,
      VP_CONFIG.INITIAL_BALANCE,
      TransactionType.ADMIN_ADJUSTMENT,
      null,
      "Initial signup bonus"
    );

    return data;
  }

  /**
   * Link LeetCode account
   */
  async linkLeetCode(
    userId: string,
    username: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    // Verify LeetCode account exists
    const verification = await leetCodeService.verifyUser(username);

    if (!verification.isValid) {
      return {
        success: false,
        error: "LeetCode username not found or invalid",
      };
    }

    // Check if username is already linked to another account
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("leetcode_username", username)
      .neq("id", userId)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: "This LeetCode account is already linked to another user",
      };
    }

    // Update profile
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        leetcode_username: username,
        leetcode_rating: verification.rating,
        leetcode_verified: true,
        leetcode_last_sync: new Date().toISOString(),
        avatar_url: verification.avatar || null,
      })
      .eq("id", userId);

    if (error) {
      return {
        success: false,
        error: "Failed to link LeetCode account",
      };
    }

    return { success: true };
  }

  /**
   * Sync LeetCode stats
   */
  async syncLeetCodeStats(userId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const profile = await this.getProfile(userId);

    if (!profile?.leetcode_username) {
      return {
        success: false,
        error: "No LeetCode account linked",
      };
    }

    const verification = await leetCodeService.verifyUser(
      profile.leetcode_username
    );

    if (!verification.isValid) {
      return {
        success: false,
        error: "Failed to sync LeetCode stats",
      };
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        leetcode_rating: verification.rating,
        leetcode_last_sync: new Date().toISOString(),
      })
      .eq("id", userId);

    return { success: true };
  }

  /**
   * Get user's VP balance
   */
  async getVPBalance(userId: string): Promise<number> {
    const profile = await this.getProfile(userId);
    return profile?.vp_balance || 0;
  }

  /**
   * Add VP to user's account
   */
  async addVP(
    userId: string,
    amount: number,
    type: TransactionType,
    referenceId?: string,
    description?: string
  ): Promise<boolean> {
    const profile = await this.getProfile(userId);

    if (!profile) {
      return false;
    }

    const newBalance = profile.vp_balance + amount;

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        vp_balance: newBalance,
        vp_lifetime_earned: profile.vp_lifetime_earned + amount,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error adding VP:", error);
      return false;
    }

    // Record transaction
    await this.recordVPTransaction(
      userId,
      amount,
      newBalance,
      type,
      referenceId,
      description
    );

    return true;
  }

  /**
   * Deduct VP from user's account
   */
  async deductVP(
    userId: string,
    amount: number,
    type: TransactionType,
    referenceId?: string,
    description?: string
  ): Promise<boolean> {
    const profile = await this.getProfile(userId);

    if (!profile) {
      return false;
    }

    if (profile.vp_balance < amount) {
      log(LogLevel.WARN, "Insufficient VP balance", { userId, amount });
      return false; // Insufficient balance
    }

    const newBalance = profile.vp_balance - amount;

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        vp_balance: newBalance,
        vp_lifetime_spent: profile.vp_lifetime_spent + amount,
      })
      .eq("id", userId);

    if (error) {
      log(LogLevel.ERROR, "Error deducting VP", error);
      return false;
    }

    // Record transaction
    await this.recordVPTransaction(
      userId,
      -amount,
      newBalance,
      type,
      referenceId,
      description
    );

    return true;
  }

  /**
   * Record VP transaction for audit trail
   */
  private async recordVPTransaction(
    userId: string,
    amount: number,
    balanceAfter: number,
    type: TransactionType,
    referenceId?: string | null,
    description?: string | null
  ): Promise<void> {
    await supabaseAdmin.from("vp_transactions").insert({
      user_id: userId,
      amount,
      balance_after: balanceAfter,
      transaction_type: type,
      reference_id: referenceId,
      description,
    });
  }

  /**
   * Get user's transaction history
   */
  async getTransactionHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<VPTransaction[]> {
    const offset = (page - 1) * limit;

    const { data, error } = await supabaseAdmin
      .from("vp_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      log(LogLevel.ERROR, "Error fetching transactions", error);
      console.log("Error fetching txns - ", error)
      return [];
    }

    return data || [];
  }

  /**
   * Update user stats after game
   */
  async updateGameStats(
    userId: string,
    won: boolean,
    problemsSolved: number,
    playTime: number
  ): Promise<void> {
    const profile = await this.getProfile(userId);

    if (!profile) {
      return;
    }

    const updates: any = {
      total_games: profile.total_games + 1,
      total_problems_solved: profile.total_problems_solved + problemsSolved,
      total_play_time: profile.total_play_time + playTime,
      last_played_at: new Date().toISOString(),
    };

    if (won) {
      updates.games_won = profile.games_won + 1;
      updates.tier_points =
        profile.tier_points + TIER_POINTS_PER_WIN[profile.tier];

      // Update streak
      const lastPlayed = profile.last_played_at
        ? new Date(profile.last_played_at)
        : null;
      const now = new Date();

      if (lastPlayed) {
        const daysDiff = Math.floor(
          (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Consecutive day - increment streak
          updates.current_streak = profile.current_streak + 1;
          updates.longest_streak = Math.max(
            profile.longest_streak,
            updates.current_streak
          );
        } else if (daysDiff > 1) {
          // Streak broken
          updates.current_streak = 1;
        }
        // Same day - no change to streak
      } else {
        // First game
        updates.current_streak = 1;
        updates.longest_streak = 1;
      }
    } else {
      updates.games_lost = profile.games_lost + 1;
    }

    await supabaseAdmin.from("profiles").update(updates).eq("id", userId);
  }

  /**
   * Claim daily login reward
   */
  async claimDailyReward(userId: string): Promise<{
    success: boolean;
    vpAwarded?: number;
    streak?: number;
    error?: string;
  }> {
    const profile = await this.getProfile(userId);

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    const today = new Date().toISOString().split("T")[0];

    // Check if already claimed today
    const { data: existingReward } = await supabaseAdmin
      .from("daily_rewards")
      .select("*")
      .eq("user_id", userId)
      .eq("reward_date", today)
      .single();

    if (existingReward) {
      return { success: false, error: "Daily reward already claimed" };
    }

    // Calculate reward with streak bonus
    let baseReward = VP_CONFIG.DAILY_LOGIN_REWARD;
    const streak = profile.current_streak || 1;

    let multiplier = 1;
    for (const [streakDay, mult] of Object.entries(
      VP_CONFIG.STREAK_MULTIPLIERS
    )) {
      if (streak >= parseInt(streakDay)) {
        multiplier = mult;
      }
    }

    const vpAwarded = Math.floor(baseReward * multiplier);

    // Add VP
    await this.addVP(
      userId,
      vpAwarded,
      TransactionType.DAILY_REWARD,
      undefined,
      `Daily reward (${streak}-day streak, ${multiplier}x multiplier)`
    );

    // Record reward claim
    await supabaseAdmin.from("daily_rewards").insert({
      user_id: userId,
      reward_date: today,
      vp_awarded: vpAwarded,
      streak_day: streak,
    });

    return {
      success: true,
      vpAwarded,
      streak,
    };
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    totalGames: number;
    gamesWon: number;
    gamesLost: number;
    winRate: number;
    totalProblemsSolved: number;
    currentStreak: number;
    longestStreak: number;
    tier: string;
    tierPoints: number;
    globalRank: number | null;
    vpBalance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
  } | null> {
    const profile = await this.getProfile(userId);

    if (!profile) {
      return null;
    }

    const winRate =
      profile.total_games > 0
        ? (profile.games_won / profile.total_games) * 100
        : 0;

    return {
      totalGames: profile.total_games,
      gamesWon: profile.games_won,
      gamesLost: profile.games_lost,
      winRate: Math.round(winRate * 100) / 100,
      totalProblemsSolved: profile.total_problems_solved,
      currentStreak: profile.current_streak,
      longestStreak: profile.longest_streak,
      tier: profile.tier,
      tierPoints: profile.tier_points,
      globalRank: profile.global_rank,
      vpBalance: profile.vp_balance,
      lifetimeEarned: profile.vp_lifetime_earned,
      lifetimeSpent: profile.vp_lifetime_spent,
    };
  }

  /**
   * Ban user
   */
  async banUser(userId: string, reason: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        is_banned: true,
        ban_reason: reason,
      })
      .eq("id", userId);

    return !error;
  }

  /**
   * Check if user is banned
   */
  async isBanned(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    return profile?.is_banned || false;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: {
      display_name?: string;
      bio?: string;
      country?: string;
      avatar_url?: string;
    }
  ): Promise<boolean> {
    const dbUpdates: any = {};

    if (updates.display_name !== undefined)
      dbUpdates.display_name = updates.display_name;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.country !== undefined) dbUpdates.country = updates.country;
    if (updates.avatar_url !== undefined)
      dbUpdates.avatar_url = updates.avatar_url;

    const { error } = await supabaseAdmin
      .from("profiles")
      .update(dbUpdates)
      .eq("id", userId);

    return !error;
  }

  /**
   * Fetch user profile + computed stats for dashboard.
   * Uses v_user_stats view (from schema) for summarized stats.
   */
  async getStats(userId: string) {
    try {
      // 1️⃣ Get user's main profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error("User profile not found");
      }

      // 2️⃣ Fetch extended stats from view `v_user_stats`
      const { data: statsView, error: statsError } = await supabaseAdmin
        .from("v_user_stats")
        .select("*")
        .eq("id", userId)
        .single();

      if (statsError) {
        log(
          LogLevel.WARN,
          "v_user_stats fetch failed, falling back to profile",
          statsError.message
        );
      }

      // 3️⃣ Get recent VP transactions (last 5)
      const { data: transactions, error: txError } = await supabaseAdmin
        .from("vp_transactions")
        .select("id, amount, transaction_type, description, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (txError) {
        log(LogLevel.WARN, "Failed to fetch transactions", txError.message);
      }

      // 4️⃣ Get daily streak info (from daily_rewards)
      const { data: lastReward, error: rewardError } = await supabaseAdmin
        .from("daily_rewards")
        .select("reward_date, streak_day, vp_awarded")
        .eq("user_id", userId)
        .order("reward_date", { ascending: false })
        .limit(1)
        .single();

      if (rewardError) {
        log(
          LogLevel.WARN,
          "No recent daily reward record",
          rewardError.message
        );
      }

      // 5️⃣ Construct response object (merge everything)
      const response = {
        id: profile.id,
        display_name: profile.display_name,
        email: profile.email,
        tier: profile.tier,
        tier_points: profile.tier_points,
        vp_balance: profile.vp_balance,
        vp_lifetime_earned: profile.vp_lifetime_earned,
        vp_lifetime_spent: profile.vp_lifetime_spent,
        total_games: profile.total_games,
        games_won: profile.games_won,
        games_lost: profile.games_lost,
        total_problems_solved: profile.total_problems_solved,
        current_streak: profile.current_streak,
        longest_streak: profile.longest_streak,
        last_played_at: profile.last_played_at,
        global_rank: profile.global_rank,
        leetcode_username: profile.leetcode_username,
        leetcode_rating: profile.leetcode_rating,
        is_premium: profile.is_premium,
        premium_until: profile.premium_until,
        avatar_url: profile.avatar_url,
        stats: statsView || null,
        recent_transactions: transactions || [],
        last_reward: lastReward || null,
      };

      return response;
    } catch (error: any) {
      log(LogLevel.ERROR, "Error fetching user stats", error.message);
      throw error;
    }
  }
}

// Singleton instance
export const userService = new UserService();

// Export for testing
export { UserService };
