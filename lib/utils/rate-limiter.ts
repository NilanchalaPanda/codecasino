import { GameDifficulty, GameType, TierLevel } from "../types";
import { GAME_TIME_LIMITS } from "./constants";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count < maxRequests) {
    entry.count++;
    return { allowed: true };
  }

  return {
    allowed: false,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  };
}

export function getSubmitRateLimit(
  difficulty: GameDifficulty,
  gameType: GameType,
  tier: TierLevel
) {
  // Base submissions per 10 minutes per difficulty
  const BASE_LIMITS: Record<GameDifficulty, number> = {
    [GameDifficulty.EASY]: 6,
    [GameDifficulty.MEDIUM]: 4,
    [GameDifficulty.HARD]: 3,
  };

  // Tier multipliers (more leniency for beginners)
  const TIER_MULTIPLIER: Record<TierLevel, number> = {
    [TierLevel.BRONZE]: 1.5,
    [TierLevel.SILVER]: 1.3,
    [TierLevel.GOLD]: 1.1,
    [TierLevel.PLATINUM]: 1.0,
    [TierLevel.DIAMOND]: 0.8,
  };

  const base = BASE_LIMITS[difficulty];
  const timeLimit = GAME_TIME_LIMITS[difficulty][gameType]; // in minutes
  const multiplier = TIER_MULTIPLIER[tier];

  // Calculate allowed submissions dynamically
  const totalSubmissions = Math.ceil(base * (timeLimit / 10) * multiplier);

  return {
    WINDOW_MS: timeLimit * 60 * 1000, // full game duration
    MAX_REQUESTS: totalSubmissions,
  };
}
