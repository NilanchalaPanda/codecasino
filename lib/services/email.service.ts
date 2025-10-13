import { log, LogLevel } from "../utils/logger";

export const emailService = {
  async sendGameNotification(
    email: string,
    poolId: string,
    type: "started" | "ended" | "prize_won"
  ) {
    try {
      // ! Send email using SendGrid, AWS SES, etc.

      log(LogLevel.INFO, "Email notification sent", {
        email,
        poolId,
        type,
      });

      return { success: true };
    } catch (error: any) {
      log(LogLevel.ERROR, "Email notification failed", error);
      throw error;
    }
  },

  async sendPrizeNotification(
    email: string,
    amount: number,
    placement: number
  ) {
    const placementText = ["1st", "2nd", "3rd"][placement - 1];
    log(LogLevel.INFO, "Prize notification prepared", {
      email,
      placement: placementText,
      amount,
    });

    return { success: true };
  },
};
