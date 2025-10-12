import { createSupabaseServerClient } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();

    return successResponse({ redirectUrl: "/" });
  } catch (error: any) {
    log(LogLevel.ERROR, "Signout error", error);
    return errorResponse(error.message, 500);
  }
}
