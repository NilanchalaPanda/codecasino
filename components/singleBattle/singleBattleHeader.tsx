"use client";
import { Users, Clock, Gem, ShieldCheck, Trophy } from "lucide-react";

interface BattleHeaderProps {
  battle: {
    title: string;
    status: string;
    prizePool: number;
    entryFee: number;
    currentPlayers: number;
    maxPlayers: number;
    difficulty: string;
    currency: string;
    timeLimit: number;
  };
}

export default function BattleHeader({ battle }: BattleHeaderProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "waiting":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden mb-8">
      {/* Background with theme image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/battle-bg.jpg')" }}
      ></div>

      {/* Content container with better spacing */}
      <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-gray-700">
        {/* Title and status row - more spaced out */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                {battle.title}
              </h1>
              <div
                className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                  battle.status
                )}`}
              >
                {battle.status.charAt(0).toUpperCase() + battle.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Action buttons - better spacing */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="px-6 py-2.5 bg-cyan/90 hover:bg-cyan text-background rounded-full text-sm md:text-base font-mono transition-colors flex-1 md:flex-none">
              Join Battle ({battle.entryFee} {battle.currency})
            </button>
            <button className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-foreground rounded-full text-sm md:text-base font-mono transition-colors flex-1 md:flex-none">
              👁 Spectate
            </button>
          </div>
        </div>

        {/* Battle info cards - better organized grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Prize Pool */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="text-yellow-400 h-5 w-5" />
              <span className="text-gray-400 text-sm">Prize Pool</span>
            </div>
            <div className="text-lg font-bold">
              {battle.prizePool}{" "}
              <span className="text-cyan">{battle.currency}</span>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Users className="text-cyan h-5 w-5" />
              <span className="text-gray-400 text-sm">Warriors</span>
            </div>
            <div className="text-lg font-bold">
              {battle.currentPlayers}/{battle.maxPlayers}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="text-purple-400 h-5 w-5" />
              <span className="text-gray-400 text-sm">Duration</span>
            </div>
            <div className="text-lg font-bold">{battle.timeLimit} minutes</div>
          </div>

          {/* Difficulty */}
          <div
            className={`bg-gray-800/50 p-4 rounded-lg border ${getDifficultyColor(
              battle.difficulty
            )}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-gray-400 text-sm">Difficulty</span>
            </div>
            <div className="text-lg font-bold capitalize">
              {battle.difficulty}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
