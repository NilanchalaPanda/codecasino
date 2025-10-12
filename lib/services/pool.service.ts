import { supabaseAdmin } from "../supabase/server";
import {
  GamePool,
  GameParticipant,
  GameDifficulty,
  GameType,
  PoolStatus,
  LeetCodeProblem,
  TransactionType,
} from "../types";
import {
  GAME_TIME_LIMITS,
  QUESTION_COUNTS,
  POOL_CONFIG,
  DEFAULT_PRIZE_DISTRIBUTION,
  ERROR_MESSAGES,
} from "../utils/constants";
import { leetCodeService } from "./leetcode.service";
import { userService } from "./user.service";
import { nanoid } from "nanoid";

class PoolService {
  /**
   * Create a new game pool
   */
  async createPool(
    creatorId: string,
    difficulty: GameDifficulty,
    gameType: GameType,
    entryFee: number,
    maxPlayers: number = POOL_CONFIG.DEFAULT_MAX_PLAYERS,
    isPrivate: boolean = false,
    scheduledStart?: Date
  ): Promise<{ success: boolean; poolId?: string; error?: string }> {
    // Validation
    if (
      entryFee < POOL_CONFIG.MIN_ENTRY_FEE ||
      entryFee > POOL_CONFIG.MAX_ENTRY_FEE
    ) {
      return { success: false, error: "Invalid entry fee" };
    }

    if (
      maxPlayers < POOL_CONFIG.MIN_PLAYERS ||
      maxPlayers > POOL_CONFIG.MAX_PLAYERS
    ) {
      return { success: false, error: "Invalid max players" };
    }

    // Get time limit
    const timeLimitMinutes = GAME_TIME_LIMITS[difficulty][gameType];
    const questionCount = QUESTION_COUNTS[gameType];

    // Generate invite code for private pools
    const inviteCode = isPrivate ? nanoid(10) : null;

    const { data, error } = await supabaseAdmin
      .from("game_pools")
      .insert({
        difficulty,
        game_type: gameType,
        question_count: questionCount,
        time_limit_minutes: timeLimitMinutes,
        entry_fee: entryFee,
        max_players: maxPlayers,
        min_players: POOL_CONFIG.MIN_PLAYERS,
        first_place_pct: DEFAULT_PRIZE_DISTRIBUTION.FIRST_PLACE,
        second_place_pct: DEFAULT_PRIZE_DISTRIBUTION.SECOND_PLACE,
        third_place_pct: DEFAULT_PRIZE_DISTRIBUTION.THIRD_PLACE,
        house_edge_pct: DEFAULT_PRIZE_DISTRIBUTION.HOUSE_EDGE,
        is_private: isPrivate,
        invite_code: inviteCode,
        scheduled_start: scheduledStart?.toISOString() || null,
        created_by: creatorId,
        status: PoolStatus.WAITING,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating pool:", error);
      return { success: false, error: "Failed to create pool" };
    }

    return { success: true, poolId: data.id };
  }

  /**
   * Join a pool
   */
  async joinPool(
    userId: string,
    poolId: string,
    inviteCode?: string
  ): Promise<{ success: boolean; error?: string }> {
    // Check if user is banned
    const isBanned = await userService.isBanned(userId);
    if (isBanned) {
      return { success: false, error: ERROR_MESSAGES.ACCOUNT_BANNED };
    }

    // Get pool
    const pool = await this.getPool(poolId);
    if (!pool) {
      return { success: false, error: ERROR_MESSAGES.POOL_NOT_FOUND };
    }

    // Validate pool status
    if (pool.status !== PoolStatus.WAITING) {
      return { success: false, error: ERROR_MESSAGES.POOL_STARTED };
    }

    // Check if pool is full
    if (pool.current_players >= pool.max_players) {
      return { success: false, error: ERROR_MESSAGES.POOL_FULL };
    }

    // Check private pool invite code
    if (pool.is_private && pool.invite_code !== inviteCode) {
      return { success: false, error: ERROR_MESSAGES.INVALID_INVITE_CODE };
    }

    // Check if already in pool
    const existingParticipant = await this.getParticipant(poolId, userId);
    if (existingParticipant) {
      return { success: false, error: ERROR_MESSAGES.ALREADY_IN_POOL };
    }

    // Check VP balance
    const vpBalance = await userService.getVPBalance(userId);
    if (vpBalance < pool.entry_fee) {
      return { success: false, error: ERROR_MESSAGES.INSUFFICIENT_VP };
    }

    // Deduct entry fee
    const deducted = await userService.deductVP(
      userId,
      pool.entry_fee,
      TransactionType.GAME_ENTRY,
      poolId,
      `Entry fee for pool ${poolId}`
    );

    if (!deducted) {
      return { success: false, error: ERROR_MESSAGES.INSUFFICIENT_VP };
    }

    // Assign problems
    const problems = await leetCodeService.getRandomProblems(
      pool.difficulty,
      pool.question_count
    );

    if (problems.length < pool.question_count) {
      // Refund if we can't assign problems
      await userService.addVP(
        userId,
        pool.entry_fee,
        TransactionType.GAME_ENTRY,
        poolId
      );
      return { success: false, error: "Failed to assign problems" };
    }

    // Add time limits to problems
    const problemsWithTime: LeetCodeProblem[] = problems.map((p) => ({
      ...p,
      timeLimit: pool.time_limit_minutes * 60, // Convert to seconds
    }));

    // Create participant
    const { error } = await supabaseAdmin.from("game_participants").insert({
      pool_id: poolId,
      user_id: userId,
      problems_assigned: problemsWithTime,
    });

    if (error) {
      console.error("Error joining pool:", error);
      // Refund
      await userService.addVP(
        userId,
        pool.entry_fee,
        TransactionType.GAME_ENTRY,
        poolId
      );
      return { success: false, error: "Failed to join pool" };
    }

    // Check if pool is now full and should auto-start
    const updatedPool = await this.getPool(poolId);
    if (updatedPool && updatedPool.current_players >= updatedPool.max_players) {
      // Schedule auto-start after delay
      setTimeout(async () => {
        await this.startPool(poolId);
      }, POOL_CONFIG.AUTO_START_DELAY * 1000);
    }

    return { success: true };
  }

  /**
   * Leave a pool (before it starts)
   */
  async leavePool(
    userId: string,
    poolId: string
  ): Promise<{ success: boolean; error?: string }> {
    const pool = await this.getPool(poolId);

    if (!pool) {
      return { success: false, error: ERROR_MESSAGES.POOL_NOT_FOUND };
    }

    if (pool.status !== PoolStatus.WAITING) {
      return {
        success: false,
        error: "Cannot leave pool after it has started",
      };
    }

    const participant = await this.getParticipant(poolId, userId);
    if (!participant) {
      return { success: false, error: "Not in this pool" };
    }

    // Delete participant
    const { error } = await supabaseAdmin
      .from("game_participants")
      .delete()
      .eq("pool_id", poolId)
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: "Failed to leave pool" };
    }

    // Refund entry fee
    await userService.addVP(
      userId,
      pool.entry_fee,
      TransactionType.GAME_ENTRY,
      poolId,
      "Refund for leaving pool"
    );

    // Update pool player count
    await supabaseAdmin
      .from("game_pools")
      .update({
        current_players: pool.current_players - 1,
        total_prize_pool: (pool.current_players - 1) * pool.entry_fee,
      })
      .eq("id", poolId);

    return { success: true };
  }

  /**
   * Start a pool (begin the game)
   */
  async startPool(
    poolId: string
  ): Promise<{ success: boolean; error?: string }> {
    const pool = await this.getPool(poolId);

    if (!pool) {
      return { success: false, error: ERROR_MESSAGES.POOL_NOT_FOUND };
    }

    if (pool.status !== PoolStatus.WAITING) {
      return { success: false, error: ERROR_MESSAGES.GAME_ALREADY_STARTED };
    }

    if (pool.current_players < pool.min_players) {
      return { success: false, error: ERROR_MESSAGES.MIN_PLAYERS_NOT_MET };
    }

    const now = new Date();
    const endTime = new Date(
      now.getTime() + pool.time_limit_minutes * 60 * 1000
    );

    // Update pool status
    const { error } = await supabaseAdmin
      .from("game_pools")
      .update({
        status: PoolStatus.ACTIVE,
        actual_start: now.toISOString(),
        end_time: endTime.toISOString(),
      })
      .eq("id", poolId);

    if (error) {
      return { success: false, error: "Failed to start pool" };
    }

    // Update all participants to active
    await supabaseAdmin
      .from("game_participants")
      .update({
        is_active: true,
        started_at: now.toISOString(),
      })
      .eq("pool_id", poolId);

    // Schedule auto-complete
    setTimeout(async () => {
      await this.completePool(poolId);
    }, pool.time_limit_minutes * 60 * 1000);

    return { success: true };
  }

  /**
   * Complete a pool and distribute prizes
   */
  async completePool(
    poolId: string
  ): Promise<{ success: boolean; error?: string }> {
    const pool = await this.getPool(poolId);

    if (!pool) {
      return { success: false, error: ERROR_MESSAGES.POOL_NOT_FOUND };
    }

    if (pool.status !== PoolStatus.ACTIVE) {
      return { success: false, error: "Pool is not active" };
    }

    // Get all participants and rank them
    const participants = await this.getPoolParticipants(poolId);

    // Sort by: problems solved (desc), then time taken (asc)
    const ranked = participants.sort((a, b) => {
      if (b.problems_solved !== a.problems_solved) {
        return b.problems_solved - a.problems_solved;
      }
      return (a.completion_time || Infinity) - (b.completion_time || Infinity);
    });

    // Assign ranks
    for (let i = 0; i < ranked.length; i++) {
      await supabaseAdmin
        .from("game_participants")
        .update({ rank: i + 1 })
        .eq("id", ranked[i].id);
    }

    // Calculate and distribute prizes
    const totalPrize = pool.total_prize_pool;
    const houseCut = Math.floor(totalPrize * (pool.house_edge_pct / 100));
    const distributionPool = totalPrize - houseCut;

    const prizes = [
      Math.floor(distributionPool * (pool.first_place_pct / 100)),
      Math.floor(distributionPool * (pool.second_place_pct / 100)),
      Math.floor(distributionPool * (pool.third_place_pct / 100)),
    ];

    // Distribute to top 3
    for (let i = 0; i < Math.min(3, ranked.length); i++) {
      const participant = ranked[i];
      const prize = prizes[i];

      if (prize > 0 && participant.problems_solved > 0) {
        await userService.addVP(
          participant.user_id,
          prize,
          TransactionType.GAME_WIN,
          poolId,
          `Prize for rank ${i + 1} in pool ${poolId}`
        );

        await supabaseAdmin
          .from("game_participants")
          .update({ prize_won: prize })
          .eq("id", participant.id);

        // Update user stats
        await userService.updateGameStats(
          participant.user_id,
          true,
          participant.problems_solved,
          participant.total_time_taken
        );
      } else if (i > 0) {
        // Not a winner
        await userService.updateGameStats(
          participant.user_id,
          false,
          participant.problems_solved,
          participant.total_time_taken
        );
      }
    }

    // Update losers' stats
    for (let i = 3; i < ranked.length; i++) {
      await userService.updateGameStats(
        ranked[i].user_id,
        false,
        ranked[i].problems_solved,
        ranked[i].total_time_taken
      );
    }

    // Mark pool as completed
    await supabaseAdmin
      .from("game_pools")
      .update({ status: PoolStatus.COMPLETED })
      .eq("id", poolId);

    return { success: true };
  }

  /**
   * Get pool by ID
   */
  async getPool(poolId: string): Promise<GamePool | null> {
    const { data, error } = await supabaseAdmin
      .from("game_pools")
      .select("*")
      .eq("id", poolId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Get participant
   */
  async getParticipant(
    poolId: string,
    userId: string
  ): Promise<GameParticipant | null> {
    const { data, error } = await supabaseAdmin
      .from("game_participants")
      .select("*")
      .eq("pool_id", poolId)
      .eq("user_id", userId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Get all participants in a pool
   */
  async getPoolParticipants(poolId: string): Promise<GameParticipant[]> {
    const { data, error } = await supabaseAdmin
      .from("game_participants")
      .select("*")
      .eq("pool_id", poolId)
      .order("rank", { ascending: true, nullsFirst: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Get available pools
   */
  async getAvailablePools(difficulty?: GameDifficulty): Promise<GamePool[]> {
    let query = supabaseAdmin
      .from("game_pools")
      .select("*")
      .eq("status", PoolStatus.WAITING)
      .eq("is_private", false)
      .lt("current_players", supabaseAdmin.rpc("max_players"));

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Get active pools
   */
  async getActivePools(): Promise<GamePool[]> {
    const { data, error } = await supabaseAdmin
      .from("game_pools")
      .select("*")
      .eq("status", PoolStatus.ACTIVE)
      .order("actual_start", { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Get user's active games
   */
  async getUserActiveGames(userId: string): Promise<GamePool[]> {
    const { data, error } = await supabaseAdmin
      .from("game_participants")
      .select("pool_id")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error || !data) {
      return [];
    }

    const poolIds = data.map((p) => p.pool_id);

    if (poolIds.length === 0) {
      return [];
    }

    const { data: pools } = await supabaseAdmin
      .from("game_pools")
      .select("*")
      .in("id", poolIds)
      .in("status", [PoolStatus.WAITING, PoolStatus.ACTIVE]);

    return pools || [];
  }

  /**
   * Get user's game history
   */
  async getUserGameHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<GameParticipant[]> {
    const offset = (page - 1) * limit;

    const { data, error } = await supabaseAdmin
      .from("game_participants")
      .select("*")
      .eq("user_id", userId)
      .not("rank", "is", null)
      .order("joined_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Cancel a pool (if not started and minimum players not met)
   */
  async cancelPool(
    poolId: string
  ): Promise<{ success: boolean; error?: string }> {
    const pool = await this.getPool(poolId);

    if (!pool) {
      return { success: false, error: ERROR_MESSAGES.POOL_NOT_FOUND };
    }

    if (pool.status !== PoolStatus.WAITING) {
      return { success: false, error: "Can only cancel waiting pools" };
    }

    // Refund all participants
    const participants = await this.getPoolParticipants(poolId);

    for (const participant of participants) {
      await userService.addVP(
        participant.user_id,
        pool.entry_fee,
        TransactionType.GAME_ENTRY,
        poolId,
        "Refund - pool cancelled"
      );
    }

    // Update pool status
    await supabaseAdmin
      .from("game_pools")
      .update({ status: PoolStatus.CANCELLED })
      .eq("id", poolId);

    return { success: true };
  }
}

// Singleton instance
export const poolService = new PoolService();

// Export for testing
export { PoolService };
