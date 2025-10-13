import { supabaseAdmin } from "@/lib/supabase/server";
import { log, LogLevel } from "@/lib/utils/logger";

interface TransactionPayload {
  userId: string;
  amount: number;
  transactionType: string;
  referenceId?: string;
  description?: string;
}

export const transactionService = {
  /**
   * Record a new transaction
   */
  async recordTransaction(payload: TransactionPayload) {
    try {
      const { data: balance } = await supabaseAdmin
        .from("profiles")
        .select("vp_balance, vp_lifetime_earned, vp_lifetime_spent")
        .eq("id", payload.userId)
        .single();

      if (!balance) throw new Error("User not found");

      const balanceAfter = balance.vp_balance + payload.amount;

      const { data, error } = await supabaseAdmin
        .from("vp_transactions")
        .insert({
          user_id: payload.userId,
          amount: payload.amount,
          balance_after: balanceAfter,
          transaction_type: payload.transactionType,
          reference_id: payload.referenceId,
          description: payload.description,
        })
        .select()
        .single();

      if (error) throw error;

      // Update profile balance
      await supabaseAdmin
        .from("profiles")
        .update({
          vp_balance: balanceAfter,
          vp_lifetime_earned:
            payload.amount > 0
              ? balance.vp_lifetime_earned + payload.amount
              : balance.vp_lifetime_earned,
          vp_lifetime_spent:
            payload.amount < 0
              ? balance.vp_lifetime_spent + Math.abs(payload.amount)
              : balance.vp_lifetime_spent,
        })
        .eq("id", payload.userId);

      log(LogLevel.INFO, "Transaction recorded", {
        userId: payload.userId,
        amount: payload.amount,
        type: payload.transactionType,
      });

      return data;
    } catch (error: any) {
      log(LogLevel.ERROR, "Transaction recording failed", error);
      throw error;
    }
  },

  /**
   * Transfer VP between users
   */
  async transferVP(
    fromUserId: string,
    toUserId: string,
    amount: number,
    reason: string
  ) {
    try {
      // Use transaction-like approach
      const debit = await this.recordTransaction({
        userId: fromUserId,
        amount: -amount,
        transactionType: "transfer_out",
        description: reason,
      });

      const credit = await this.recordTransaction({
        userId: toUserId,
        amount: amount,
        transactionType: "transfer_in",
        description: reason,
      });

      return { debit, credit };
    } catch (error: any) {
      log(LogLevel.ERROR, "VP transfer failed", error);
      throw error;
    }
  },

  /**
   * Distribute prizes to users
   */
  async distributePrizes(
    poolId: string,
    prizeDistribution: Array<{
      userId: string;
      placement: number;
      amount: number;
    }>
  ) {
    try {
      const results = [];

      for (const prize of prizeDistribution) {
        const transaction = await this.recordTransaction({
          userId: prize.userId,
          amount: prize.amount,
          transactionType: "game_win",
          referenceId: poolId,
          description: `Prize for ${
            prize.placement === 1
              ? "1st"
              : prize.placement === 2
              ? "2nd"
              : "3rd"
          } place`,
        });

        results.push(transaction);
      }

      log(LogLevel.INFO, "Prizes distributed", {
        poolId,
        prizeCount: results.length,
        totalAmount: prizeDistribution.reduce((acc, p) => acc + p.amount, 0),
      });

      return results;
    } catch (error: any) {
      log(LogLevel.ERROR, "Prize distribution failed", error);
      throw error;
    }
  },

  /**
   * Charge entry fee when a user joins a pool
   */
  async chargeEntryFee(userId: string, poolId: string, amount: number) {
    try {
      const { data: balance } = await supabaseAdmin
        .from("profiles")
        .select("vp_balance")
        .eq("id", userId)
        .single();

      if (!balance) throw new Error("User not found");
      if (balance.vp_balance < amount)
        throw new Error("Insufficient VP balance");

      return await this.recordTransaction({
        userId,
        amount: -amount,
        transactionType: "game_entry",
        referenceId: poolId,
        description: `Entry fee for pool ${poolId}`,
      });
    } catch (error: any) {
      log(LogLevel.ERROR, "Entry fee charge failed", error);
      throw error;
    }
  },
};
