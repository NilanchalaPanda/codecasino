import { poolService } from "@/lib/services/pool.service";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";
import { GameDifficulty } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficultyParam = searchParams.get("difficulty");
    const gameType = searchParams.get("gameType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // ✅ Use enum values dynamically
    const allowedDifficulties = Object.values(GameDifficulty);
    const difficulty = allowedDifficulties.includes(
      difficultyParam as GameDifficulty
    )
      ? (difficultyParam as GameDifficulty)
      : undefined;

    const pools = await poolService.getAvailablePools({
      difficulty,
      game_type: gameType || undefined,
      page,
      limit,
    });

    return successResponse(pools, "Fetched available pools successfully");
  } catch (error: any) {
    log(LogLevel.ERROR, "Get available pools error", error);
    return errorResponse(error.message, 500);
  }
}
