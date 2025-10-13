import { gameService } from "@/lib/services/game.service";
import { userService } from "@/lib/services/user.service";
import { requireAuth } from "@/lib/supabase/server";
import { ERROR_MESSAGES } from "@/lib/utils/constants";
import { log, LogLevel } from "@/lib/utils/logger";
import { checkRateLimit, getSubmitRateLimit } from "@/lib/utils/rate-limiter";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(
  request: Request,
  { params }: { params: { poolId: string } }
) {
  try {
    const user = await requireAuth();

    // Check if user is banned
    const isBanned = await userService.isBanned(user.id);
    if (isBanned) {
      log(LogLevel.INFO, ERROR_MESSAGES.ACCOUNT_BANNED, { userId: user.id });
      return errorResponse(ERROR_MESSAGES.ACCOUNT_BANNED, 403);
    }

    // Get submission context from request body
    const { userId, difficulty, gameType, tier } = await request.json();

    // Dynamically calculate the rate limit for this context
    const limit = getSubmitRateLimit(difficulty, gameType, tier);

    // Check rate limit
    const rateLimit = checkRateLimit(
      `submit_problem_${userId}_${difficulty}_${gameType}`,
      limit.WINDOW_MS,
      limit.MAX_REQUESTS
    );

    if (!rateLimit.allowed) {
      return errorResponse(
        `Submission limit reached. Try again after ${rateLimit.retryAfter} seconds.`,
        429
      );
    }

    const body = await request.json();
    const { problemId, timeTaken, leetcodeSubmissionId } = body;

    if (!problemId || timeTaken === undefined) {
      return errorResponse("Missing required fields", 400);
    }

    const result = await gameService.submitProblem(
      user.id,
      params.poolId,
      problemId,
      timeTaken,
      leetcodeSubmissionId
    );

    if (!result.success) {
      return errorResponse(result.error ?? "Unexpected error", 400);
    }

    log(LogLevel.INFO, "Problem submitted", {
      userId: user.id,
      poolId: params.poolId,
      problemId,
    });

    return successResponse(result.data);
  } catch (error: any) {
    log(LogLevel.ERROR, "Submit problem error", error);
    return errorResponse(error.message, 500);
  }
}
