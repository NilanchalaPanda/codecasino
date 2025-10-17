import { leaderboardService } from "@/lib/services/leaderboard.service";
import { TierLevel } from "@/lib/types";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tier: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const validTiers: string[] = Object.values(TierLevel);
    if (!validTiers.includes((await params).tier)) {
      return errorResponse("Invalid tier", 400);
    }

    // Cast the string to TierLevel enum
    const tier: TierLevel = (await params).tier as TierLevel;

    const leaderboard = await leaderboardService.getTierLeaderboard(
      tier, // Pass the correct type here
      page,
      limit
    );

    return successResponse(leaderboard);
  } catch (error: any) {
    log(LogLevel.ERROR, "Get tier leaderboard error", error);
    return errorResponse(error.message, 500);
  }
}
