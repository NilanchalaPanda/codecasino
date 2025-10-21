import { createSupabaseServerClient } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse } from "@/lib/utils/response";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") || "http://localhost:3000/dashboard";
    if (!code) {
      return errorResponse("No authorization code received", 400);
    }

    console.log("HEY THERE");

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      log(LogLevel.ERROR, "Auth callback error", error);
      return NextResponse.redirect(`/auth/error?message=${error.message}`);
    }
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError) {
      console.log("Get User Error - ", getUserError);
    }

    console.log("userdata - ", user);

    if (user) {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        console.log("User fetching error - ", fetchError);
      }

      const userData = {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.name || "Anonymous",
        avatar_url: user.user_metadata?.avatar_url,
        vp_balance: profile ? profile.vp_balance : 1000,
        vp_lifetime_earned: profile ? profile.vp_lifetime_earned : 1000,
        first_name: user.user_metadata?.given_name,
        last_name: user.user_metadata?.family_name,
      };
      if (!profile) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert(userData);
        if (insertError) {
          console.error("Insert error:", insertError);
        }
      } else {
        await supabase.from("profiles").update(userData).eq("id", user.id);
      }
    }
    return NextResponse.redirect(next);
  } catch (error: any) {
    log(LogLevel.ERROR, "Callback route error", error);
    return errorResponse(error.message, 500);
  }
}
