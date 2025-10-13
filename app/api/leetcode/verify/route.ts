import { leetCodeService } from "@/lib/services/leetcode.service";
import { requireAuth } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(request: Request) {
  try {
    const user = await requireAuth(); // Authenticated user
    const body = await request.json(); // Get the body of the request
    const { username } = body; // LeetCode username from the request body

    if (!username) {
      return errorResponse("LeetCode username required", 400); // Handle missing username
    }

    // Call verifyUser to check the validity of the LeetCode account
    const result = await leetCodeService.verifyUser(username);

    if (!result.isValid) {
      // If the user is not valid, return an error with the specific message
      return errorResponse(
        result.error || "Failed to verify LeetCode account",
        400
      );
    }

    // Log the successful verification
    log(LogLevel.INFO, "LeetCode account verified", {
      userId: user.id,
      username,
    });

    // Return success response with the valid data
    return successResponse({
      rating: result.rating,
      totalSolved: result.totalSolved,
      avatar: result.avatar,
    });
  } catch (error: any) {
    log(LogLevel.ERROR, "LeetCode verification error", error);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
