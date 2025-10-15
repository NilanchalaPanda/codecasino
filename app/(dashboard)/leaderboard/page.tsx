"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Zap } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  tier: string;
  tierPoints: number;
  gamesWon: number;
  totalGames: number;
  currentStreak: number;
  vpBalance: number;
}

export default function LeaderboardPage() {
  const supabase = createClient();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const endpoint =
          selectedTier === "all"
            ? "/api/leaderboard/global"
            : `/api/leaderboard/tier/${selectedTier}`;

        const response = await fetch(endpoint);
        const data = await response.json();
        setLeaderboard(data.data?.leaderboard || []);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedTier]);

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
      <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-900 to-pink-900">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">
              Global Leaderboard
            </h1>
            <p className="text-indigo-200">Top performers across all tiers</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedTier("all")}
            className={`rounded-lg px-4 py-2 font-medium whitespace-nowrap ${
              selectedTier === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
            }`}
          >
            All Tiers
          </button>
          {["bronze", "silver", "gold", "platinum", "diamond"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`rounded-lg px-4 py-2 font-medium whitespace-nowrap ${
                selectedTier === tier
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
              }`}
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-600">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-2">Tier</div>
              <div className="col-span-2">Games Won</div>
              <div className="col-span-2">Win Rate</div>
              <div className="col-span-1">Streak</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-200">
              {leaderboard.map((player, index) => (
                <div
                  key={player.userId}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 transition"
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        player.rank === 1
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                          : player.rank === 2
                          ? "bg-gradient-to-br from-slate-300 to-slate-500 text-white"
                          : player.rank === 3
                          ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {player.rank}
                    </div>
                  </div>

                  {/* Player */}
                  <div className="col-span-4 flex items-center">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {player.displayName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {player.tierPoints.toLocaleString()} pts
                      </p>
                    </div>
                  </div>

                  {/* Tier */}
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold ${
                        tierColors[player.tier]
                      }`}
                    >
                      {player.tier.toUpperCase()}
                    </span>
                  </div>

                  {/* Games Won */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-slate-900 font-medium">
                      {player.gamesWon}/{player.totalGames}
                    </span>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-indigo-600 font-medium">
                      {((player.gamesWon / player.totalGames) * 100).toFixed(1)}
                      %
                    </span>
                  </div>

                  {/* Streak */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-pink-600" />
                      <span className="text-pink-600 font-bold">
                        {player.currentStreak}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
