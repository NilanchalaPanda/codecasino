"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, Trophy, Zap, TrendingUp } from "lucide-react";

interface UserStats {
  vp_balance: number;
  tier: string;
  games_won: number;
  total_games: number;
  current_streak: number;
  global_rank: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // if (!session) {
        //   router.push("/login");
        //   return;
        // }

        const response = await fetch("/api/user/stats");
        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const tierColors: { [key: string]: string } = {
    bronze: "bg-amber-600",
    silver: "bg-slate-400",
    gold: "bg-yellow-500",
    platinum: "bg-cyan-400",
    diamond: "bg-purple-500",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">
            Welcome back! Here's your performance overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* VP Balance */}
          <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-600">VP Balance</p>
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {stats?.vp_balance.toLocaleString()}
            </div>
          </div>

          {/* Tier */}
          <div className="rounded-lg bg-gradient-to-br from-pink-50 to-white border border-pink-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-600">Current Tier</p>
              <Trophy className="w-5 h-5 text-pink-600" />
            </div>
            <div
              className={`inline-block px-3 py-1 rounded-full text-white text-lg font-bold ${
                tierColors[stats?.tier || "bronze"]
              }`}
            >
              {stats?.tier?.toUpperCase()}
            </div>
          </div>

          {/* Win Rate */}
          <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-600">Win Rate</p>
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {stats && stats.total_games > 0
                ? ((stats.games_won / stats.total_games) * 100).toFixed(1)
                : "0"}
              %
            </div>
          </div>

          {/* Global Rank */}
          <div className="rounded-lg bg-gradient-to-br from-pink-50 to-white border border-pink-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-600">Global Rank</p>
              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
            <div className="text-3xl font-bold text-pink-600">
              #{stats?.global_rank || "N/A"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          <button className="rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 p-8 text-white font-semibold hover:shadow-lg transition">
            <div className="text-4xl mb-2">⚡</div>
            <p>Find & Join Pool</p>
            <p className="text-sm font-normal opacity-90">
              Start competing now
            </p>
          </button>

          <button className="rounded-lg bg-white border-2 border-slate-200 p-8 text-slate-900 font-semibold hover:border-indigo-600 hover:text-indigo-600 transition">
            <div className="text-4xl mb-2">📊</div>
            <p>View Leaderboard</p>
            <p className="text-sm font-normal opacity-75">
              Check global rankings
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
