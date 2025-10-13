import { leaderboardService } from "@/lib/services/leaderboard.service";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

    const leaderboard = await leaderboardService.getGlobalLeaderboard(
      page,
      limit
    );

    return successResponse(leaderboard);
  } catch (error: any) {
    log(LogLevel.ERROR, "Get global leaderboard error", error);
    return errorResponse(error.message, 500);
  }
}
