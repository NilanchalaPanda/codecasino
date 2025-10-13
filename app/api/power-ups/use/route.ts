import { requireAuth, supabaseAdmin } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { poolId, powerUpId, problemId } = body;

    if (!poolId || !powerUpId) {
      return errorResponse("Missing required fields", 400);
    }

    // Record power-up usage
    const { error } = await supabaseAdmin.from("power_up_usage").insert({
      user_id: user.id,
      power_up_id: powerUpId,
      pool_id: poolId,
    });

    if (error) throw error;

    // Decrement inventory
    const { data: inventory } = await supabaseAdmin
      .from("user_power_ups")
      .select("*")
      .eq("user_id", user.id)
      .eq("power_up_id", powerUpId)
      .single();

    if (inventory && inventory.quantity > 1) {
      await supabaseAdmin
        .from("user_power_ups")
        .update({ quantity: inventory.quantity - 1 })
        .eq("id", inventory.id);
    } else {
      await supabaseAdmin
        .from("user_power_ups")
        .delete()
        .eq("id", inventory.id);
    }

    log(LogLevel.INFO, "Power-up used", {
      userId: user.id,
      poolId,
      powerUpId,
    });

    return successResponse({ success: true });
  } catch (error: any) {
    log(LogLevel.ERROR, "Power-up usage error", error);
    return errorResponse(error.message, 500);
  }
}
