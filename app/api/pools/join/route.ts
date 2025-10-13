import { poolService } from "@/lib/services/pool.service";
import { userService } from "@/lib/services/user.service";
import { requireAuth } from "@/lib/supabase/server";
import { ERROR_MESSAGES, RATE_LIMITS } from "@/lib/utils/constants";
import { log, LogLevel } from "@/lib/utils/logger";
import { checkRateLimit } from "@/lib/utils/rate-limiter";
import { errorResponse, successResponse } from "@/lib/utils/response";
import { NextRequest } from "next/server";

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

    const rateLimit = checkRateLimit(
      `join_pool_${user.id}`,
      RATE_LIMITS.POOL_JOIN.WINDOW_MS,
      RATE_LIMITS.POOL_JOIN.MAX_REQUESTS
    );

    if (!rateLimit.allowed) {
      return errorResponse(
        `Rate limited. Retry after ${rateLimit.retryAfter} seconds`,
        429
      );
    }

    const body = await request.json();
    const { poolId, inviteCode } = body;

    if (!poolId) {
      return errorResponse("Pool ID required", 400);
    }

    // Call service to join pool
    const response = await poolService.joinPool(user.id, poolId, inviteCode);

    // Parse the NextResponse body
    const result = await response.json();

    if (!result.success) {
      return errorResponse(result.error, 400);
    }

    log(LogLevel.INFO, "User joined pool", {
      userId: user.id,
      poolId,
    });

    return successResponse(result.data, "Joined pool successfully");
  } catch (error: any) {
    log(LogLevel.ERROR, "Join pool error", error);
    return errorResponse(error.message, 500);
  }
}
