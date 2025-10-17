import { gameService } from "@/lib/services/game.service";
import { requireAuth } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ poolId: string }> }
) {
  try {
    const user = await requireAuth();
    const progress = await gameService.getParticipantProgress(
      (await params).poolId,
      user.id
    );

    if (!progress) {
      return errorResponse("Progress not found", 404);
    }

    return successResponse(progress);
  } catch (error: any) {
    log(LogLevel.ERROR, "Get progress error", error);
    return errorResponse(error.message, 500);
  }
}
