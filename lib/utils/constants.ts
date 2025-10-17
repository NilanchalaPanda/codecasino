import { GameDifficulty, GameType, TierLevel } from "../types";

// ============================================
// GAME TIMING CONFIGURATION
// ============================================

export const GAME_TIME_LIMITS: Record<
  GameDifficulty,
  Record<GameType, number>
> = {
  [GameDifficulty.EASY]: {
    [GameType.JOGGER]: 15, // 15 minutes for 1 easy problem
    [GameType.SPRINTER]: 20, // 20 minutes for 2 easy problems
    [GameType.PACER]: 30, // 30 minutes for 3 easy problems
    [GameType.MARATHON]: 40, // 40 minutes for 5 easy problems
  },
  [GameDifficulty.MEDIUM]: {
    [GameType.JOGGER]: 25, // 25 minutes for 1 medium problem
    [GameType.SPRINTER]: 35, // 35 minutes for 2 medium problems
    [GameType.PACER]: 50, // 50 minutes for 3 medium problems
    [GameType.MARATHON]: 75, // 75 minutes for 5 medium problems
  },
  [GameDifficulty.HARD]: {
    [GameType.JOGGER]: 40, // 40 minutes for 1 hard problem
    [GameType.SPRINTER]: 60, // 60 minutes for 2 hard problems
    [GameType.PACER]: 90, // 90 minutes for 3 hard problems
    [GameType.MARATHON]: 120, // 120 minutes for 5 hard problems
  },
};

export const QUESTION_COUNTS: Record<GameType, number> = {
  [GameType.JOGGER]: 1,
  [GameType.SPRINTER]: 2,
  [GameType.PACER]: 3,
  [GameType.MARATHON]: 5,
};

// ============================================
// VIRTUAL POINTS SYSTEM
// ============================================

export const VP_CONFIG = {
  INITIAL_BALANCE: 1000,
  DAILY_LOGIN_REWARD: 50,
  STREAK_MULTIPLIERS: {
    3: 1.2, // 3-day streak: +20%
    7: 1.5, // 7-day streak: +50%
    14: 2.0, // 14-day streak: +100%
    30: 2.5, // 30-day streak: +150%
  },
  MIN_ENTRY_FEE: 10,
  MAX_ENTRY_FEE: 10000,
};

// ============================================
// TIER SYSTEM
// ============================================

export const TIER_REQUIREMENTS: Record<
  TierLevel,
  { minPoints: number; maxPoints: number }
> = {
  [TierLevel.BRONZE]: { minPoints: 0, maxPoints: 999 },
  [TierLevel.SILVER]: { minPoints: 1000, maxPoints: 2499 },
  [TierLevel.GOLD]: { minPoints: 2500, maxPoints: 4999 },
  [TierLevel.PLATINUM]: { minPoints: 5000, maxPoints: 9999 },
  [TierLevel.DIAMOND]: { minPoints: 10000, maxPoints: Infinity },
};

export const TIER_POINTS_PER_WIN: Record<TierLevel, number> = {
  [TierLevel.BRONZE]: 10,
  [TierLevel.SILVER]: 15,
  [TierLevel.GOLD]: 20,
  [TierLevel.PLATINUM]: 25,
  [TierLevel.DIAMOND]: 30,
};

// ============================================
// PRIZE DISTRIBUTION
// ============================================

export const DEFAULT_PRIZE_DISTRIBUTION = {
  FIRST_PLACE: 50, // 50%
  SECOND_PLACE: 30, // 30%
  THIRD_PLACE: 15, // 15%
  HOUSE_EDGE: 5, // 5%
};

// ============================================
// POOL CONFIGURATION
// ============================================

export const POOL_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 100,
  DEFAULT_MAX_PLAYERS: 10,
  AUTO_START_DELAY: 30, // seconds after pool fills
  WAITING_TIMEOUT: 3600, // 1 hour - cancel if not filled
  MIN_ENTRY_FEE: 10,
  MAX_ENTRY_FEE: 10000,
};

// ============================================
// POOL BETTYPE
// ============================================

export const POOL_BET_TYPES = {
  VP: "vp", // Virtual Points
  REAL_MONEY: "real_money", // Real Money (future implementation)
};

// ============================================
// POWER-UPS
// ============================================

export const POWER_UP_EFFECTS = {
  EXTRA_TIME: 300, // 5 minutes in seconds
  HINT_REVEAL: 1, // reveal 1 
  SKIP_PENALTY: 0, // no penalty for skipping
  PROGRESS_REVEAL_TOP: 3, // show top 3 players
};

export const POWER_UP_COSTS = {
  EXTRA_TIME: 100,
  HINT: 150,
  SKIP_PROBLEM: 200,
  REVEAL_PROGRESS: 75,
};

// ============================================
// ANTI-CHEAT THRESHOLDS
// ============================================

export const ANTI_CHEAT = {
  MAX_SUBMISSION_DELAY: 5, // seconds - max delay between game timer and leetcode submission
  MIN_SOLVE_TIME: {
    [GameDifficulty.EASY]: 30, // 30 seconds
    [GameDifficulty.MEDIUM]: 60, // 1 minute
    [GameDifficulty.HARD]: 120, // 2 minutes
  },
  MAX_SAME_IP_ACCOUNTS: 3,
  SUSPICIOUS_PATTERNS: {
    IDENTICAL_CODE_THRESHOLD: 0.95, // 95% similarity
    RAPID_SOLVE_THRESHOLD: 0.8, // solving 80% faster than average
  },
};

// ============================================
// LEETCODE API
// ============================================

export const LEETCODE_CONFIG = {
  GRAPHQL_ENDPOINT: "https://leetcode.com/graphql",
  PROBLEMS_API: "https://leetcode.com/api/problems/all/",
  USER_PROFILE_URL: (username: string) => `https://leetcode.com/${username}/`,
  PROBLEM_URL: (slug: string) => `https://leetcode.com/problems/${slug}/`,
  RATE_LIMIT: {
    MAX_REQUESTS: 60,
    WINDOW_MS: 60000, // 1 minute
  },
};

// ============================================
// RATE LIMITING
// ============================================

export const RATE_LIMITS = {
  API: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 100,
  },
  POOL_CREATION: {
    WINDOW_MS: 300000, // 5 minutes
    MAX_REQUESTS: 5,
  },
  POOL_JOIN: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 20,
  },
};

// ============================================
// WEBSOCKET EVENTS
// ============================================

export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_POOL: "join_pool",
  LEAVE_POOL: "leave_pool",
  SUBMIT_PROBLEM: "submit_problem",
  USE_POWER_UP: "use_power_up",
  REQUEST_STATUS: "request_status",

  // Server -> Client
  POOL_UPDATED: "pool_updated",
  GAME_STARTED: "game_started",
  GAME_ENDED: "game_ended",
  PLAYER_JOINED: "player_joined",
  PLAYER_LEFT: "player_left",
  PROBLEM_SOLVED: "problem_solved",
  LEADERBOARD_UPDATED: "leaderboard_updated",
  TIME_WARNING: "time_warning",
  POWER_UP_USED: "power_up_used",
  ERROR: "error",
};

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  // Authentication
  UNAUTHORIZED: "You must be logged in to perform this action",
  INVALID_SESSION: "Invalid or expired session",

  // Profile
  LEETCODE_NOT_LINKED: "Please link your LeetCode account first",
  LEETCODE_VERIFICATION_FAILED: "Failed to verify LeetCode account",
  PROFILE_NOT_FOUND: "Profile not found",

  // Pools
  POOL_FAILED: "Failed to create pool",
  POOL_NOT_FOUND: "Game pool not found",
  POOL_FULL: "This pool is already full",
  POOL_STARTED: "This pool has already started",
  POOL_ENDED: "This pool has ended",
  ALREADY_IN_POOL: "You are already in this pool",
  INSUFFICIENT_VP: "Insufficient VP balance",
  INVALID_INVITE_CODE: "Invalid invite code",
  MIN_PLAYERS_NOT_MET: "Minimum players not met",

  // Game
  GAME_NOT_STARTED: "Game has not started yet",
  GAME_ALREADY_STARTED: "Game has already started",
  PROBLEM_ALREADY_SOLVED: "You have already solved this problem",
  INVALID_SUBMISSION: "Invalid submission",
  TIME_LIMIT_EXCEEDED: "Time limit exceeded for this problem",

  // Power-ups
  POWER_UP_NOT_FOUND: "Power-up not found",
  POWER_UP_NOT_OWNED: "You do not own this power-up",
  POWER_UP_ALREADY_USED: "This power-up has already been used",
  CANNOT_USE_POWER_UP: "Cannot use power-up at this time",

  // Validation
  INVALID_INPUT: "Invalid input data",
  VALIDATION_ERROR: "Validation error",

  // Anti-cheat
  SUSPICIOUS_ACTIVITY: "Suspicious activity detected",
  ACCOUNT_BANNED: "Your account has been banned",

  // General
  INTERNAL_ERROR: "Internal server error",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Please try again later",
};

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  POOL_CREATED: "Game pool created successfully",
  POOL_JOINED: "Successfully joined the pool",
  POOL_LEFT: "Successfully left the pool",
  PROBLEM_SUBMITTED: "Problem submitted successfully",
  LEETCODE_LINKED: "LeetCode account linked successfully",
  POWER_UP_PURCHASED: "Power-up purchased successfully",
  POWER_UP_USED: "Power-up used successfully",
  PROFILE_UPDATED: "Profile updated successfully",
};

// ============================================
// CACHE KEYS & TTL
// ============================================

export const CACHE_CONFIG = {
  KEYS: {
    USER_PROFILE: (userId: string) => `user:profile:${userId}`,
    POOL_STATE: (poolId: string) => `pool:state:${poolId}`,
    LEADERBOARD: (type: string) => `leaderboard:${type}`,
    ACTIVE_POOLS: "pools:active",
    LEETCODE_PROBLEMS: "leetcode:problems",
  },
  TTL: {
    USER_PROFILE: 300, // 5 minutes
    POOL_STATE: 10, // 10 seconds (for active games)
    LEADERBOARD: 60, // 1 minute
    ACTIVE_POOLS: 30, // 30 seconds
    LEETCODE_PROBLEMS: 86400, // 24 hours
  },
};

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// ============================================
// ENVIRONMENT VARIABLES (for reference)
// ============================================

export const ENV_VARS = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!,
  REDIS_URL: process.env.REDIS_URL!,
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};