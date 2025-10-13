import { supabaseAdmin } from "../supabase/server";
import { log, LogLevel } from "../utils/logger";

export const analyticsService = {
  async trackGameEvent(userId: string, eventType: string, data: any) {
    try {
      log(LogLevel.INFO, "Analytics event tracked", {
        userId,
        eventType,
        data,
      });

      // Send to analytics platform (Mixpanel, Segment, etc.)
      return { success: true };
    } catch (error: any) {
      log(LogLevel.ERROR, "Analytics tracking failed", error);
    }
  },

  async getGameMetrics(poolId: string) {
    try {
      const { data: participants } = await supabaseAdmin
        .from("game_participants")
        .select("*")
        .eq("pool_id", poolId);

      if (!participants) return null;

      const metrics = {
        totalParticipants: participants.length,
        avgProblems:
          participants.reduce((acc, p) => acc + (p.problems_solved || 0), 0) /
          participants.length,
        avgTime:
          participants.reduce((acc, p) => acc + (p.total_time_taken || 0), 0) /
          participants.length,
        completionRate:
          (participants.filter((p) => p.finished_at).length /
            participants.length) *
          100,
      };

      return metrics;
    } catch (error: any) {
      log(LogLevel.ERROR, "Metrics calculation failed", error);
      throw error;
    }
  },
};
