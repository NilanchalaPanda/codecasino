import { requireAuth } from "@/lib/supabase/server";
import { userService } from "@/lib/services/user.service";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { log, LogLevel } from "@/lib/utils/logger";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    const result = await userService.claimDailyReward(user.id);

    if (!result.success) {
      return errorResponse(result.error || "Failed to claim reward", 400);
    }

    log(LogLevel.INFO, "Daily reward claimed", {
      userId: user.id,
      vpAwarded: result.vpAwarded,
    });

    return successResponse(result, "Daily reward claimed successfully");
  } catch (error: any) {
    log(LogLevel.ERROR, "Daily reward error", error);
    return errorResponse(error.message, 500);
  }
}
