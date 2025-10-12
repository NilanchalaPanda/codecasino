import { createSupabaseServerClient } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse } from "@/lib/utils/response";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return errorResponse("No authorization code received", 400);
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      log(LogLevel.ERROR, "Auth callback error", error);
      return redirect(`/auth/error?message=${error.message}`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.name || "Anonymous",
          avatar_url: user.user_metadata?.avatar_url,
          vp_balance: 1000,
          vp_lifetime_earned: 1000,
        });

        log(LogLevel.INFO, "New profile created", { userId: user.id });
      }
    }

    return redirect("/dashboard");
  } catch (error: any) {
    log(LogLevel.ERROR, "Callback route error", error);
    return errorResponse(error.message, 500);
  }
}
