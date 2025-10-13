import { poolService } from "@/lib/services/pool.service";
import { requireAuth } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { poolId } = body;

    if (!poolId) {
      return errorResponse("Pool ID required", 400);
    }

    const res = await poolService.leavePool(user.id, poolId);

    const result = await res.json();

    if (!result.success) {
      return errorResponse(result.error, 400);
    }

    log(LogLevel.INFO, "User left pool", {
      userId: user.id,
      poolId,
    });

    return successResponse(result.data);
  } catch (error: any) {
    log(LogLevel.ERROR, "Leave pool error", error);
    return errorResponse(error.message, 500);
  }
}
