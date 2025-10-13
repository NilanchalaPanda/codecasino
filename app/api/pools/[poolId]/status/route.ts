import { gameService } from "@/lib/services/game.service";
import { requireAuth } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function GET(
  request: Request,
  { params }: { params: { poolId: string } }
) {
  try {
    const user = await requireAuth();
    const status = await gameService.getParticipantProgress(
      params.poolId,
      user.id
    );

    if (!status) {
      return errorResponse("Game not found", 404);
    }

    return successResponse(status);
  } catch (error: any) {
    log(LogLevel.ERROR, "Get game status error", error);
    return errorResponse(error.message, 500);
  }
}
