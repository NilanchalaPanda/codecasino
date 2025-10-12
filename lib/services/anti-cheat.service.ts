import { supabaseAdmin } from '../supabase/server';
import { AntiCheatCheck, LeetCodeSubmission } from '../types';
import { ANTI_CHEAT } from '../utils/constants';

class AntiCheatService {
  /**
   * Check submission for suspicious activity
   */
  async checkSubmission(
    userId: string,
    poolId: string,
    problemId: string,
    timeTaken: number,
    leetcodeSubmission: LeetCodeSubmission
  ): Promise<AntiCheatCheck> {
    const flags: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const details: Record<string, any> = {};

    // Check 1: Submission timing
    const timingCheck = await this.checkSubmissionTiming(
      leetcodeSubmission.timestamp,
      poolId
    );
    if (!timingCheck.isPassed) {
      flags.push('timestamp_mismatch');
      severity = 'high';
      details.timingIssue = timingCheck.reason;
    }

    // Check 2: Solve speed (too fast)
    const speedCheck = this.checkSolveSpeed(timeTaken);
    if (!speedCheck.isPassed) {
      flags.push('impossible_speed');
      severity = severity === 'high' ? 'critical' : 'medium';
      details.solveSpeed = speedCheck.reason;
    }

    // Check 3: Multiple accounts from same IP
    const ipCheck = await this.checkMultipleAccounts(userId);
    if (!ipCheck.isPassed) {
      flags.push('ip_duplicate');
      severity = 'medium';
      details.ipIssue = ipCheck.reason;
    }

    // Check 4: Pattern matching (rapid successive solves)
    const patternCheck = await this.checkSolvePattern(userId, poolId);
    if (!patternCheck.isPassed) {
      flags.push('pattern_match');
      severity = 'medium';
      details.pattern = patternCheck.reason;
    }

    // Check 5: Account age and history
    const accountCheck = await this.checkAccountValidity(userId);
    if (!accountCheck.isPassed) {
      flags.push('suspicious_account');
      severity = 'low';
      details.account = accountCheck.reason;
    }

    // Report if flags found
    if (flags.length > 0) {
      await this.reportSuspiciousActivity(
        userId,
        poolId,
        flags.join(','),
        severity,
        details
      );
    }

    return {
      isPassed: flags.length === 0,
      flags,
      severity,
      details
    };
  }

  /**
   * Check submission timing against game window
   */
  private async checkSubmissionTiming(
    leetcodeTimestamp: number,
    poolId: string
  ): Promise<{ isPassed: boolean; reason?: string }> {
    const { data: pool } = await supabaseAdmin
      .from('game_pools')
      .select('actual_start, end_time')
      .eq('id', poolId)
      .single();

    if (!pool || !pool.actual_start) {
      return { isPassed: false, reason: 'Pool timing unavailable' };
    }

    const gameStart = new Date(pool.actual_start).getTime();
    const gameEnd = pool.end_time ? new Date(pool.end_time).getTime() : Date.now();
    
    const submissionTime = new Date(leetcodeTimestamp).getTime();

    // Allow small delay for API sync (5 seconds)
    const maxDelay = ANTI_CHEAT.MAX_SUBMISSION_DELAY * 1000;
    
    if (submissionTime < gameStart - maxDelay) {
      return { 
        isPassed: false, 
        reason: `Submission before game start (${(gameStart - submissionTime) / 1000}s early)` 
      };
    }

    if (submissionTime > gameEnd + maxDelay) {
      return { 
        isPassed: false, 
        reason: `Submission after game end (${(submissionTime - gameEnd) / 1000}s late)` 
      };
    }

    return { isPassed: true };
  }

  /**
   * Check if solve speed is suspiciously fast
   */
  private checkSolveSpeed(timeTaken: number): { isPassed: boolean; reason?: string } {
    // For now, use easy threshold - should be dynamic based on problem difficulty
    const minTime = ANTI_CHEAT.MIN_SOLVE_TIME.easy;

    if (timeTaken < minTime) {
      return {
        isPassed: false,
        reason: `Solved in ${timeTaken}s (minimum expected: ${minTime}s)`
      };
    }

    return { isPassed: true };
  }

  /**
   * Check for multiple accounts from same IP (placeholder - needs Redis/session tracking)
   */
  private async checkMultipleAccounts(
    userId: string
  ): Promise<{ isPassed: boolean; reason?: string }> {
    // TODO: Implement IP tracking with Redis
    // For now, return passed
    return { isPassed: true };
  }

  /**
   * Check solve patterns (e.g., all problems solved in suspiciously similar times)
   */
  private async checkSolvePattern(
    userId: string,
    poolId: string
  ): Promise<{ isPassed: boolean; reason?: string }> {
    const { data: submissions } = await supabaseAdmin
      .from('problem_submissions')
      .select('time_taken')
      .eq('user_id', userId)
      .eq('pool_id', poolId)
      .order('submitted_at', { ascending: true });

    if (!submissions || submissions.length < 2) {
      return { isPassed: true };
    }

    // Check if all submissions have very similar times (within 10% variance)
    const times = submissions.map(s => s.time_taken).filter(t => t != null);
    if (times.length < 2) {
      return { isPassed: true };
    }

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.map(t => Math.abs(t - avg) / avg);
    
    const maxVariance = Math.max(...variance);
    if (maxVariance < 0.1) { // Less than 10% variance
      return {
        isPassed: false,
        reason: `Suspiciously consistent solve times (${maxVariance * 100}% variance)`
      };
    }

    return { isPassed: true };
  }

  /**
   * Check account validity (age, previous games, etc.)
   */
  private async checkAccountValidity(
    userId: string
  ): Promise<{ isPassed: boolean; reason?: string }> {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('created_at, total_games, leetcode_verified')
      .eq('id', userId)
      .single();

    if (!profile) {
      return { isPassed: false, reason: 'Profile not found' };
    }

    // Check if account is too new
    const accountAge = Date.now() - new Date(profile.created_at).getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (accountAge < oneDayMs && profile.total_games > 5) {
      return {
        isPassed: false,
        reason: `New account (${Math.floor(accountAge / oneDayMs)}d) with ${profile.total_games} games`
      };
    }

    // Check if LeetCode is verified
    if (!profile.leetcode_verified) {
      return {
        isPassed: false,
        reason: 'LeetCode account not verified'
      };
    }

    return { isPassed: true };
  }

  /**
   * Report suspicious activity
   */
  private async reportSuspiciousActivity(
    userId: string,
    poolId: string,
    reportType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: Record<string, any>
  ): Promise<void> {
    await supabaseAdmin
      .from('anti_cheat_reports')
      .insert({
        user_id: userId,
        pool_id: poolId,
        report_type: reportType,
        severity,
        details
      });

    // Auto-ban on critical severity
    if (severity === 'critical') {
      await supabaseAdmin
        .from('profiles')
        .update({
          is_banned: true,
          ban_reason: `Automated ban: ${reportType}`
        })
        .eq('id', userId);
    }

    // Flag participant
    await supabaseAdmin
      .from('game_participants')
      .update({ suspicious_activity: true })
      .eq('pool_id', poolId)
      .eq('user_id', userId);
  }

  /**
   * Get anti-cheat reports for a user
   */
  async getUserReports(userId: string): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('anti_cheat_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Get unresolved reports (for admin review)
   */
  async getUnresolvedReports(limit: number = 50): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('anti_cheat_reports')
      .select('*')
      .eq('is_resolved', false)
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Resolve a report
   */
  async resolveReport(
    reportId: string,
    resolution: string,
    banUser: boolean = false
  ): Promise<boolean> {
    const { data: report } = await supabaseAdmin
      .from('anti_cheat_reports')
      .select('user_id')
      .eq('id', reportId)
      .single();

    if (!report) {
      return false;
    }

    // Update report
    await supabaseAdmin
      .from('anti_cheat_reports')
      .update({
        is_resolved: true,
        resolution_notes: resolution
      })
      .eq('id', reportId);

    // Ban user if requested
    if (banUser) {
      await supabaseAdmin
        .from('profiles')
        .update({
          is_banned: true,
          ban_reason: resolution
        })
        .eq('id', report.user_id);
    }

    return true;
  }
}

// Singleton instance
export const antiCheatService = new AntiCheatService();

// Export for testing
export { AntiCheatService };