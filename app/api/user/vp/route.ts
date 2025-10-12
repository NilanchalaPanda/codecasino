import { userService } from "@/lib/services/user.service";
import { requireAuth } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function GET() {
  try {
    const user = await requireAuth();
    const vp = await userService.getVPBalance(user.id);

    return successResponse({ balance: vp }, "VP fetched successfully");
  } catch (error: any) {
    log(LogLevel.ERROR, "Get VP error", error);
    return errorResponse(error.message, 500);
  }
}
