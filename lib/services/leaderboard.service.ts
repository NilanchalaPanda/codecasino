import { supabaseAdmin } from "../supabase/server";
import { LeaderboardEntry, TierLevel } from "../types";
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth } from "date-fns";

class LeaderboardService {
  /**
   * Get global leaderboard (all-time)
   */
  async getGlobalLeaderboard(
    page: number = 1,
    limit: number = 100
  ): Promise<LeaderboardEntry[]> {
    const offset = (page - 1) * limit;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, display_name, leetcode_username, tier, tier_points, games_won, total_games, vp_balance, current_streak"
      )
      .eq("is_banned", false)
      .order("tier_points", { ascending: false })
      .order("games_won", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching global leaderboard:", error);
      return [];
    }

    return (data || []).map((profile, index) => ({
      rank: offset + index + 1,
      user_id: profile.id,
      display_name: profile.display_name,
      leetcode_username: profile.leetcode_username,
      tier: profile.tier,
      tier_points: profile.tier_points,
      games_won: profile.games_won,
      total_games: profile.total_games,
      win_rate:
        profile.total_games > 0
          ? Math.round((profile.games_won / profile.total_games) * 10000) / 100
          : 0,
      vp_balance: profile.vp_balance,
      current_streak: profile.current_streak,
    }));
  }

  /**
   * Get weekly leaderboard
   */
  async getWeeklyLeaderboard(
    page: number = 1,
    limit: number = 100
  ): Promise<any[]> {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    return this.getLeaderboardForPeriod(
      "weekly",
      weekStart,
      weekEnd,
      page,
      limit
    );
  }

  /**
   * Get monthly leaderboard
   */
  async getMonthlyLeaderboard(
    page: number = 1,
    limit: number = 100
  ): Promise<any[]> {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return this.getLeaderboardForPeriod(
      "monthly",
      monthStart,
      monthEnd,
      page,
      limit
    );
  }

  /**
   * Get leaderboard for specific period
   */
  private async getLeaderboardForPeriod(
    periodType: string,
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number
  ): Promise<any[]> {
    const offset = (page - 1) * limit;

    const { data, error } = await supabaseAdmin
      .from("leaderboards")
      .select(
        `
        *,
        profiles:user_id (
          display_name,
          leetcode_username,
          tier,
          avatar_url
        )
      `
      )
      .eq("period_type", periodType)
      .gte("period_start", startDate.toISOString().split("T")[0])
      .lte("period_end", endDate.toISOString().split("T")[0])
      .order("net_vp", { ascending: false })
      .order("games_won", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }

    return (data || []).map((entry: any, index) => ({
      rank: offset + index + 1,
      userId: entry.user_id,
      displayName: entry.profiles?.display_name || "Anonymous",
      leetcodeUsername: entry.profiles?.leetcode_username,
      tier: entry.profiles?.tier,
      gamesPlayed: entry.games_played,
      gamesWon: entry.games_won,
      winRate: entry.win_rate,
      totalVpWon: entry.total_vp_won,
      totalVpLost: entry.total_vp_lost,
      netVp: entry.net_vp,
      problemsSolved: entry.problems_solved,
      avatarUrl: entry.profiles?.avatar_url,
    }));
  }

  /**
   * Get tier-specific leaderboard
   */
  async getTierLeaderboard(
    tier: TierLevel,
    page: number = 1,
    limit: number = 50
  ): Promise<LeaderboardEntry[]> {
    const offset = (page - 1) * limit;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, display_name, leetcode_username, tier, tier_points, games_won, total_games, vp_balance, current_streak"
      )
      .eq("tier", tier)
      .eq("is_banned", false)
      .order("tier_points", { ascending: false })
      .order("games_won", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching tier leaderboard:", error);
      return [];
    }

    return (data || []).map((profile, index) => ({
      rank: offset + index + 1,
      user_id: profile.id,
      display_name: profile.display_name,
      leetcode_username: profile.leetcode_username,
      tier: profile.tier,
      tier_points: profile.tier_points,
      games_won: profile.games_won,
      total_games: profile.total_games,
      win_rate:
        profile.total_games > 0
          ? Math.round((profile.games_won / profile.total_games) * 10000) / 100
          : 0,
      vp_balance: profile.vp_balance,
      current_streak: profile.current_streak,
    }));
  }

  /**
   * Update leaderboard entries after game completion
   */
  async updateLeaderboardEntry(
    userId: string,
    vpWon: number,
    vpLost: number,
    won: boolean,
    problemsSolved: number,
    timeTaken: number
  ): Promise<void> {
    const now = new Date();

    // Update daily
    await this.upsertLeaderboardEntry(
      userId,
      "daily",
      now,
      now,
      vpWon,
      vpLost,
      won,
      problemsSolved,
      timeTaken
    );

    // Update weekly
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    await this.upsertLeaderboardEntry(
      userId,
      "weekly",
      weekStart,
      weekEnd,
      vpWon,
      vpLost,
      won,
      problemsSolved,
      timeTaken
    );

    // Update monthly
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    await this.upsertLeaderboardEntry(
      userId,
      "monthly",
      monthStart,
      monthEnd,
      vpWon,
      vpLost,
      won,
      problemsSolved,
      timeTaken
    );

    // Update all-time
    await this.upsertLeaderboardEntry(
      userId,
      "all_time",
      new Date("2024-01-01"),
      new Date("2099-12-31"),
      vpWon,
      vpLost,
      won,
      problemsSolved,
      timeTaken
    );
  }

  /**
   * Upsert leaderboard entry
   */
  private async upsertLeaderboardEntry(
    userId: string,
    periodType: string,
    periodStart: Date,
    periodEnd: Date,
    vpWon: number,
    vpLost: number,
    won: boolean,
    problemsSolved: number,
    timeTaken: number
  ): Promise<void> {
    const periodStartStr = periodStart.toISOString().split("T")[0];
    const periodEndStr = periodEnd.toISOString().split("T")[0];

    // Check if entry exists
    const { data: existing } = await supabaseAdmin
      .from("leaderboards")
      .select("*")
      .eq("user_id", userId)
      .eq("period_type", periodType)
      .eq("period_start", periodStartStr)
      .single();

    if (existing) {
      // Update existing
      const newGamesPlayed = existing.games_played + 1;
      const newGamesWon = existing.games_won + (won ? 1 : 0);
      const newTotalVpWon = existing.total_vp_won + vpWon;
      const newTotalVpLost = existing.total_vp_lost + vpLost;
      const newNetVp = newTotalVpWon - newTotalVpLost;
      const newProblemsSolved = existing.problems_solved + problemsSolved;
      const newAverageTime = Math.floor(
        (existing.average_time * existing.games_played + timeTaken) /
          newGamesPlayed
      );
      const newWinRate =
        newGamesPlayed > 0
          ? Math.round((newGamesWon / newGamesPlayed) * 10000) / 100
          : 0;

      await supabaseAdmin
        .from("leaderboards")
        .update({
          games_played: newGamesPlayed,
          games_won: newGamesWon,
          win_rate: newWinRate,
          total_vp_won: newTotalVpWon,
          total_vp_lost: newTotalVpLost,
          net_vp: newNetVp,
          problems_solved: newProblemsSolved,
          average_time: newAverageTime,
        })
        .eq("id", existing.id);
    } else {
      // Insert new
      const winRate = won ? 100 : 0;
      const netVp = vpWon - vpLost;

      // Get user's tier
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("tier")
        .eq("id", userId)
        .single();

      await supabaseAdmin.from("leaderboards").insert({
        user_id: userId,
        period_type: periodType,
        period_start: periodStartStr,
        period_end: periodEndStr,
        games_played: 1,
        games_won: won ? 1 : 0,
        win_rate: winRate,
        total_vp_won: vpWon,
        total_vp_lost: vpLost,
        net_vp: netVp,
        problems_solved: problemsSolved,
        average_time: timeTaken,
        tier: profile?.tier || "bronze",
      });
    }
  }

  /**
   * Get user's rank across all leaderboards
   */
  async getUserRanks(userId: string): Promise<{
    global: number | null;
    weekly: number | null;
    monthly: number | null;
    tier: number | null;
  }> {
    // Global rank
    const { data: globalData } = await supabaseAdmin
      .from("profiles")
      .select("tier_points")
      .eq("is_banned", false)
      .order("tier_points", { ascending: false });

    const globalRank = globalData?.findIndex((p) => p.tier_points) || null;

    // Weekly rank
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const { data: weeklyData } = await supabaseAdmin
      .from("leaderboards")
      .select("user_id, net_vp")
      .eq("period_type", "weekly")
      .gte("period_start", weekStart.toISOString().split("T")[0])
      .order("net_vp", { ascending: false });

    const weeklyRank =
      weeklyData?.findIndex((l) => l.user_id === userId) || null;

    // Monthly rank
    const monthStart = startOfMonth(new Date());
    const { data: monthlyData } = await supabaseAdmin
      .from("leaderboards")
      .select("user_id, net_vp")
      .eq("period_type", "monthly")
      .gte("period_start", monthStart.toISOString().split("T")[0])
      .order("net_vp", { ascending: false });

    const monthlyRank =
      monthlyData?.findIndex((l) => l.user_id === userId) || null;

    // Tier rank
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("tier")
      .eq("id", userId)
      .single();

    let tierRank = null;
    if (profile?.tier) {
      const { data: tierData } = await supabaseAdmin
        .from("profiles")
        .select("id, tier_points")
        .eq("tier", profile.tier)
        .eq("is_banned", false)
        .order("tier_points", { ascending: false });

      tierRank = tierData?.findIndex((p) => p.id === userId) || null;
      if (tierRank !== null) tierRank += 1; // Convert to 1-indexed
    }

    return {
      global: globalRank !== null ? globalRank + 1 : null,
      weekly: weeklyRank !== null ? weeklyRank + 1 : null,
      monthly: monthlyRank !== null ? monthlyRank + 1 : null,
      tier: tierRank,
    };
  }

  /**
   * Search users in leaderboard
   */
  async searchUsers(
    query: string,
    limit: number = 20
  ): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, display_name, leetcode_username, tier, tier_points, games_won, total_games, vp_balance, current_streak"
      )
      .or(`display_name.ilike.%${query}%,leetcode_username.ilike.%${query}%`)
      .eq("is_banned", false)
      .order("tier_points", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error searching users:", error);
      return [];
    }

    return (data || []).map((profile, index) => ({
      rank: index + 1,
      user_id: profile.id,
      display_name: profile.display_name,
      leetcode_username: profile.leetcode_username,
      tier: profile.tier,
      tier_points: profile.tier_points,
      games_won: profile.games_won,
      total_games: profile.total_games,
      win_rate:
        profile.total_games > 0
          ? Math.round((profile.games_won / profile.total_games) * 10000) / 100
          : 0,
      vp_balance: profile.vp_balance,
      current_streak: profile.current_streak,
    }));
  }
}

// Singleton instance
export const leaderboardService = new LeaderboardService();

// Export for testing
export { LeaderboardService };
