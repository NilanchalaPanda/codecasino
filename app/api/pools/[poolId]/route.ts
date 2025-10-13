import { poolService } from "@/lib/services/pool.service";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function GET(
  request: Request,
  { params }: { params: { poolId: string } }
) {
  try {
    const { poolId } = params;
    const pool = await poolService.getPoolDetailsById(poolId);

    if (!pool) {
      return errorResponse("Pool not found", 404);
    }

    return successResponse(pool);
  } catch (error: any) {
    log(LogLevel.ERROR, "Get pool error", error);
    return errorResponse(error.message, 500);
  }
}
