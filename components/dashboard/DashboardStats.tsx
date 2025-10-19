import { Swords, Trophy, Flame, Code, Clock, BarChart3 } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalBattles: number;
    winRate: number;
    currentStreak: number;
    problemsSolved: number;
    playTime: number;
    vpEarned: number;
    vpSpent: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Swords className="text-cyan h-5 w-5" />
          <span className="text-gray-400 text-sm">Total Battles</span>
        </div>
        <div className="text-2xl font-bold">{stats.totalBattles}</div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="text-yellow-400 h-5 w-5" />
          <span className="text-gray-400 text-sm">Win Rate</span>
        </div>
        <div className="text-2xl font-bold">{stats.winRate}%</div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="text-orange-400 h-5 w-5" />
          <span className="text-gray-400 text-sm">Current Streak</span>
        </div>
        <div className="text-2xl font-bold">{stats.currentStreak}</div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Code className="text-green-400 h-5 w-5" />
          <span className="text-gray-400 text-sm">Problems Solved</span>
        </div>
        <div className="text-2xl font-bold">{stats.problemsSolved}</div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="text-purple-400 h-5 w-5" />
          <span className="text-gray-400 text-sm">Total Play Time</span>
        </div>
        <div className="text-2xl font-bold">{stats.playTime}h</div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="text-blue-400 h-5 w-5" />
          <span className="text-gray-400 text-sm">VP Earned</span>
        </div>
        <div className="text-2xl font-bold">{stats.vpEarned}</div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-red-400 h-5 w-5">VP</div>
          <span className="text-gray-400 text-sm">VP Spent</span>
        </div>
        <div className="text-2xl font-bold">{stats.vpSpent}</div>
      </div>
    </div>
  );
}
