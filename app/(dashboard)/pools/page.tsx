"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Filter, Play } from "lucide-react";

interface Pool {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  game_type: "jogger" | "sprinter" | "pacer" | "marathon";
  entry_fee: number;
  current_players: number;
  max_players: number;
  status: string;
  created_at: string;
}

export default function PoolsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // if (!session) {
        //   router.push("/login");
        //   return;
        // }

        const params = new URLSearchParams();
        if (selectedDifficulty !== "all")
          params.append("difficulty", selectedDifficulty);
        if (selectedType !== "all") params.append("gameType", selectedType);

        const response = await fetch(`/api/pools/available?${params}`);
        const data = await response.json();
        setPools(data.data?.pools || []);
      } catch (error) {
        console.error("Failed to fetch pools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, [supabase, router, selectedDifficulty, selectedType]);

  const difficultyColors: { [key: string]: string } = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  const gameTypeInfo: { [key: string]: { label: string; problems: number } } = {
    jogger: { label: "🏃 Jogger", problems: 1 },
    sprinter: { label: "💨 Sprinter", problems: 2 },
    pacer: { label: "⚡ Pacer", problems: 3 },
    marathon: { label: "🏅 Marathon", problems: 5 },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Available Pools</h1>
          <p className="text-slate-600">
            Join a competitive pool and start earning VP
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Game Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="all">All Types</option>
              <option value="jogger">Jogger (1)</option>
              <option value="sprinter">Sprinter (2)</option>
              <option value="pacer">Pacer (3)</option>
              <option value="marathon">Marathon (5)</option>
            </select>
          </div>
        </div>

        {/* Pool Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading pools...</p>
          </div>
        ) : pools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">
              No pools available matching your filters.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <div
                key={pool.id}
                className="rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition overflow-hidden"
              >
                {/* Pool Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        difficultyColors[pool.difficulty]
                      }`}
                    >
                      {pool.difficulty.toUpperCase()}
                    </span>
                    <span className="text-2xl">
                      {gameTypeInfo[pool.game_type]?.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {gameTypeInfo[pool.game_type]?.problems} problem
                    {gameTypeInfo[pool.game_type]?.problems !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Pool Body */}
                <div className="p-6">
                  {/* Entry Fee */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-slate-600">Entry Fee</span>
                    <span className="flex items-center gap-1 text-lg font-bold text-indigo-600">
                      ⚡ {pool.entry_fee}
                    </span>
                  </div>

                  {/* Players */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Players</span>
                      <span className="text-sm font-medium">
                        {pool.current_players}/{pool.max_players}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-pink-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (pool.current_players / pool.max_players) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => router.push(`/pools/${pool.id}`)}
                    className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 py-3 font-semibold text-white hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Join Pool
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
