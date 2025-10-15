"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Clock, Users, Zap, Play } from "lucide-react";

interface GameState {
  poolId: string;
  status: "active" | "completed";
  timeRemaining: number;
  leaderboard: Array<{
    rank: number;
    displayName: string;
    problemsSolved: number;
    totalTime: number;
  }>;
  myRank: number;
  currentProblem: {
    id: string;
    title: string;
    difficulty: string;
    slug: string;
  };
}

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("00:00");

  const poolId = Array.isArray(params.poolId)
    ? params.poolId[0]
    : params.poolId;

  useEffect(() => {
    if (!gameState?.timeRemaining) return;

    const timer = setInterval(() => {
      const seconds = gameState.timeRemaining;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);

      if (seconds <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState?.timeRemaining]);

  const handleSubmit = async () => {
    if (!gameState?.currentProblem) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/game/${poolId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: gameState.currentProblem.id,
          timeTaken: 300, // This should be actual time taken
          leetcodeSubmissionId: "lc-123", // From LeetCode
        }),
      });

      if (response.ok) {
        alert("Problem submitted successfully!");
      }
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Game Room</h1>

            {/* Timer */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-2xl font-bold text-indigo-600">
                  {timeLeft}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-5 h-5" />
                <span className="font-medium">
                  {gameState?.leaderboard.length} players
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Problem Panel */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white border border-slate-200 p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                    {gameState?.currentProblem?.difficulty?.toUpperCase()}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    {gameState?.currentProblem?.title}
                  </h2>
                </div>

                {/* Problem Link */}
                <a
                  href={`https://leetcode.com/problems/${gameState?.currentProblem?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition font-medium"
                >
                  <Play className="w-4 h-4" />
                  Solve on LeetCode
                </a>
              </div>

              {/* Instructions */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Instructions
                </h3>
                <ol className="space-y-3 text-slate-600">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <span>Click "Solve on LeetCode" to open the problem</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <span>Submit your solution on LeetCode</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <span>Copy your submission ID and paste below</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    <span>Click Submit to verify your solution</span>
                  </li>
                </ol>
              </div>

              {/* Submit Section */}
              <div className="border-t border-slate-200 mt-6 pt-6">
                <input
                  type="text"
                  placeholder="Paste LeetCode Submission ID"
                  className="w-full mb-4"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 py-3 font-semibold text-white hover:shadow-lg transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Solution"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live Leaderboard */}
          <div>
            <div className="rounded-lg bg-white border border-slate-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Live Leaderboard
              </h3>

              <div className="space-y-2">
                {gameState?.leaderboard.map((player, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border ${
                      player.rank === gameState.myRank
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          player.rank === 1
                            ? "bg-yellow-500"
                            : player.rank === 2
                            ? "bg-slate-400"
                            : player.rank === 3
                            ? "bg-amber-600"
                            : "bg-slate-300"
                        }`}
                      >
                        {player.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {player.displayName}
                        </p>
                        <p className="text-sm text-slate-600">
                          {player.problemsSolved} solved •{" "}
                          {Math.floor(player.totalTime / 60)}min
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
