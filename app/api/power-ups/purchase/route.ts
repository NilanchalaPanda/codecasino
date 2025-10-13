import { transactionService } from "@/lib/services/transactions.service";
import { requireAuth, supabaseAdmin } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { powerUpId } = body;

    if (!powerUpId) {
      return errorResponse("Power-up ID required", 400);
    }

    // Get power-up details
    const { data: powerUp } = await supabaseAdmin
      .from("power_ups")
      .select("*")
      .eq("id", powerUpId)
      .single();

    if (!powerUp) {
      return errorResponse("Power-up not found", 404);
    }

    // Get user balance
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("vp_balance")
      .eq("id", user.id)
      .single();

    if (!profile || profile.vp_balance < powerUp.vp_cost) {
      return errorResponse("Insufficient VP", 400);
    }

    // Check if user already has this power-up
    const { data: existing } = await supabaseAdmin
      .from("user_power_ups")
      .select("*")
      .eq("user_id", user.id)
      .eq("power_up_id", powerUpId)
      .single();

    if (existing) {
      // Update quantity
      await supabaseAdmin
        .from("user_power_ups")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
    } else {
      // Create new entry
      await supabaseAdmin.from("user_power_ups").insert({
        user_id: user.id,
        power_up_id: powerUpId,
        quantity: 1,
      });
    }

    // Deduct VP using transaction service
    await transactionService.recordTransaction({
      userId: user.id,
      amount: -powerUp.vp_cost,
      transactionType: "power_up",
      referenceId: powerUpId,
      description: `Purchased ${powerUp.name}`,
    });

    log(LogLevel.INFO, "Power-up purchased", {
      userId: user.id,
      powerUpId,
      cost: powerUp.vp_cost,
    });

    return successResponse({ powerUp, purchased: true });
  } catch (error: any) {
    log(LogLevel.ERROR, "Power-up purchase error", error);
    return errorResponse(error.message, 500);
  }
}
