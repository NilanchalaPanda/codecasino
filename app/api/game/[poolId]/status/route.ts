import { requireAuth } from "@/lib/supabase/server";
import { gameService } from "@/lib/services/game.service";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ poolId: string }> }
) {
  try {
    const user = await requireAuth();
    const poolId = (await params).poolId;

    // Get overall game state (status, leaderboard, timer)
    const gameState = await gameService.getGameState(poolId);
    if (!gameState) {
      return errorResponse("Game not found", 404);
    }

    // Get participant-specific progress
    const participantProgress = await gameService.getParticipantProgress(
      poolId,
      user.id
    );

    // Check if the participant can still submit
    const canSubmit = await gameService.canSubmit(poolId, user.id);

    return successResponse({
      status: gameState.status,
      timeRemaining: gameState.timeRemaining,
      leaderboard: gameState.leaderboard,
      participantProgress,
      canSubmit,
    });
  } catch (error: any) {
    console.error("Error fetching game status:", error);
    return errorResponse("Failed to fetch game status", 500);
  }
}
