import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/supabase/server";
import { poolService } from "@/lib/services/pool.service";
import { userService } from "@/lib/services/user.service";
import { GameDifficulty, GameType } from "@/lib/types";
import {
  ERROR_MESSAGES,
  RATE_LIMITS,
  SUCCESS_MESSAGES,
} from "@/lib/utils/constants";
import { errorResponse, successResponse } from "@/lib/utils/response";
import { checkRateLimit } from "@/lib/utils/rate-limiter";
import { log, LogLevel } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Check if user is banned
    const isBanned = await userService.isBanned(user.id);
    if (isBanned) {
      log(LogLevel.INFO, ERROR_MESSAGES.ACCOUNT_BANNED, { userId: user.id });
      return errorResponse(ERROR_MESSAGES.ACCOUNT_BANNED, 403);
    }

    // Rate limiting
    const rateLimit = checkRateLimit(
      `create_pool_${user.id}`,
      RATE_LIMITS.POOL_CREATION.WINDOW_MS,
      RATE_LIMITS.POOL_CREATION.MAX_REQUESTS
    );

    if (!rateLimit.allowed) {
      return errorResponse(
        `Rate limited. Retry after ${rateLimit.retryAfter} seconds`,
        429
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      difficulty,
      gameType,
      entryFee,
      maxPlayers,
      isPrivate,
      scheduledStart,
      betType = "vp", // Default to "vp" if not provided. Or can be "real_money"
    } = body;

    // Validate inputs
    if (!difficulty || !Object.values(GameDifficulty).includes(difficulty)) {
      return errorResponse("Invalid difficulty level", 400);
    }

    if (!gameType || !Object.values(GameType).includes(gameType)) {
      return errorResponse("Invalid game type", 400);
    }

    if (!entryFee || entryFee < 10) {
      return errorResponse("Entry fee must be at least 10 VP", 400);
    }

    // Check VP balance
    const vpBalance = await userService.getVPBalance(user.id);
    if (vpBalance < entryFee) {
      return errorResponse(ERROR_MESSAGES.INSUFFICIENT_VP, 400);
    }

    // Create pool
    const result = await poolService.createPool(
      user.id,
      difficulty,
      gameType,
      entryFee,
      maxPlayers || 10,
      isPrivate || false,
      betType,
      scheduledStart ? new Date(scheduledStart) : undefined,
    );

    if (!result.success) {
      log(LogLevel.ERROR, ERROR_MESSAGES.POOL_FAILED, {
        userId: user.id,
        error: result.error,
      });
    }

    // ! THINK ABOUT IT > Auto-join the creator.
    // await poolService.joinPool(user.id, result.poolId!);

    log(LogLevel.INFO, "Pool created", {
      poolId: result.poolId,
      userId: user.id,
    });
    return successResponse(result.poolId, SUCCESS_MESSAGES.POOL_CREATED);
  } catch (error: any) {
    log(LogLevel.ERROR, ERROR_MESSAGES.INTERNAL_ERROR, { error });
    return errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
