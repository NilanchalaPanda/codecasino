// import { leetCodeService } from "@/lib/services/leetcode.service";
// import { requireAuth } from "@/lib/supabase/server";
// import { log, LogLevel } from "@/lib/utils/logger";
// import { errorResponse, successResponse } from "@/lib/utils/response";

// export async function POST(request: Request) {
//   try {
//     const user = await requireAuth();

//     const result = await leetCodeService.syncStats(user.id);

//     if (!result.success) {
//       return errorResponse(result.error, 400);
//     }

//     log(LogLevel.INFO, "LeetCode stats synced", {
//       userId: user.id,
//     });

//     return successResponse(result.data);
//   } catch (error: any) {
//     log(LogLevel.ERROR, "LeetCode sync error", error);
//     return errorResponse(error.message, 500);
//   }
// }
