// ============================================
// ENUMS & CONSTANTS
// ============================================

export enum GameDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum GameType {
  JOGGER = 'jogger',      // 1 problem
  SPRINTER = 'sprinter',  // 2 problems
  PACER = 'pacer',        // 3 problems
  MARATHON = 'marathon'   // 5 problems
}

export enum PoolBetTypes {
  VIRTUAL_POINTS = 'vp',
  REAL_MONEY = 'real_money'
}

export enum PoolStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TierLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

export enum PowerUpType {
  EXTRA_TIME = 'extra_time',
  HINT = 'hint',
  SKIP_PROBLEM = 'skip_problem',
  REVEAL_PROGRESS = 'reveal_progress'
}

export enum TransactionType {
  GAME_ENTRY = 'game_entry',
  GAME_WIN = 'game_win',
  DAILY_REWARD = 'daily_reward',
  POWER_UP_PURCHASE = 'power_up_purchase',
  POWER_UP_REFUND = 'power_up_refund',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
  REFERRAL_BONUS = 'referral_bonus'
}

// ============================================
// DATABASE TYPES
// ============================================

export interface Profile {
  id: string;
  email: string;
  leetcode_username: string | null;
  leetcode_rating: number;
  leetcode_verified: boolean;
  leetcode_last_sync: string | null;
  
  vp_balance: number;
  vp_lifetime_earned: number;
  vp_lifetime_spent: number;
  
  total_games: number;
  games_won: number;
  games_lost: number;
  total_problems_solved: number;
  total_play_time: number;
  
  current_streak: number;
  longest_streak: number;
  last_played_at: string | null;
  
  tier: TierLevel;
  tier_points: number;
  global_rank: number | null;
  
  avatar_url: string | null;
  display_name: string | null;
  bio: string | null;
  country: string | null;
  
  is_banned: boolean;
  ban_reason: string | null;
  is_premium: boolean;
  premium_until: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface GamePool {
  id: string;
  difficulty: GameDifficulty;
  game_type: GameType;
  question_count: number;
  time_limit_minutes: number;
  
  entry_fee: number;
  total_prize_pool: number;
  max_players: number;
  min_players: number;
  current_players: number;
  
  status: PoolStatus;
  scheduled_start: string | null;
  actual_start: string | null;
  end_time: string | null;
  
  first_place_pct: number;
  second_place_pct: number;
  third_place_pct: number;
  house_edge_pct: number;
  
  is_private: boolean;
  invite_code: string | null;
  allow_spectators: boolean;
  
  is_battle_royale: boolean;
  elimination_rounds: number | null;
  
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeetCodeProblem {
  problemId: string;
  title: string;
  difficulty: GameDifficulty;
  slug: string;
  timeLimit: number; // seconds
  acceptanceRate?: number;
  topics?: string[];
}

export interface GameParticipant {
  id: string;
  pool_id: string;
  user_id: string;
  
  problems_assigned: LeetCodeProblem[];
  problems_solved: number;
  problems_attempted: number;
  total_time_taken: number;
  completion_time: number | null;
  
  rank: number | null;
  prize_won: number;
  
  power_ups_used: PowerUpUsage[];
  submission_timestamps: SubmissionTimestamp[];
  suspicious_activity: boolean;
  
  is_active: boolean;
  is_eliminated: boolean;
  joined_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface SubmissionTimestamp {
  problemId: string;
  submittedAt: string;
  verifiedAt: string | null;
}

export interface PowerUpUsage {
  powerUpId: string;
  powerUpType: PowerUpType;
  usedAt: string;
  problemId?: string;
}

export interface ProblemSubmission {
  id: string;
  participant_id: string;
  pool_id: string;
  user_id: string;
  
  problem_id: string;
  problem_slug: string;
  
  submitted_at: string;
  leetcode_submission_id: string | null;
  leetcode_submission_time: string | null;
  
  is_accepted: boolean;
  verified_at: string | null;
  verification_method: string | null;
  
  time_taken: number | null;
  within_time_limit: boolean | null;
  
  is_suspicious: boolean;
  suspicion_reasons: string[];
}

export interface VPTransaction {
  id: string;
  user_id: string;
  amount: number;
  balance_after: number;
  transaction_type: TransactionType;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string | null;
  leetcode_username: string | null;
  tier: TierLevel;
  tier_points: number;
  games_won: number;
  total_games: number;
  win_rate: number;
  vp_balance: number;
  current_streak: number;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreatePoolRequest {
  difficulty: GameDifficulty;
  gameType: GameType;
  entryFee: number;
  maxPlayers: number;
  isPrivate?: boolean;
  scheduledStart?: string;
}

export interface JoinPoolRequest {
  poolId: string;
  inviteCode?: string;
}

export interface SubmitProblemRequest {
  poolId: string;
  problemId: string;
  submissionId?: string;
  timeTaken: number;
}

export interface UsePowerUpRequest {
  poolId: string;
  powerUpId: string;
  problemId?: string;
}

export interface LeetCodeVerificationRequest {
  username: string;
}

export interface LeetCodeSubmission {
  id: string;
  timestamp: number;
  statusDisplay: string;
  lang: string;
  runtime: string;
  memory: string;
  title: string;
  titleSlug: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// GAME LOGIC TYPES
// ============================================

export interface GameState {
  poolId: string;
  status: PoolStatus;
  participants: GameParticipant[];
  startTime: string | null;
  endTime: string | null;
  timeRemaining: number; // seconds
  leaderboard: ParticipantStatus[];
}

export interface ParticipantStatus {
  userId: string;
  displayName: string | null;
  problemsSolved: number;
  totalProblems: number;
  timeTaken: number;
  rank: number | null;
  isFinished: boolean;
}

export interface PrizeDistribution {
  first: number;
  second: number;
  third: number;
  house: number;
}

export interface GameResult {
  poolId: string;
  winners: Winner[];
  prizeDistribution: PrizeDistribution;
  totalParticipants: number;
}

export interface Winner {
  userId: string;
  rank: number;
  problemsSolved: number;
  timeTaken: number;
  prizeAmount: number;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface AntiCheatCheck {
  isPassed: boolean;
  flags: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
}