import { Swords, Trophy, Flame, Clock, Code, BarChart3, Check } from "lucide-react";

interface ProfileStatsProps {
  user: {
    totalGames: number;
    gamesWon: number;
    gamesLost: number;
    totalProblemsSolved: number;
    totalPlayTime: number;
    currentStreak: number;
    longestStreak: number;
    vpBalance: number;
    vpLifetimeEarned: number;
    vpLifetimeSpent: number;
    leetcodeRating: number;
    leetcodeVerified: boolean;
  };
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  const winRate =
    user.totalGames > 0
      ? Math.round((user.gamesWon / user.totalGames) * 100)
      : 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-6">Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="text-cyan" />
            <span className="text-gray-400 text-sm">Total Battles</span>
          </div>
          <div className="text-2xl font-bold">{user.totalGames}</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="text-yellow-400" />
            <span className="text-gray-400 text-sm">Win Rate</span>
          </div>
          <div className="text-2xl font-bold">{winRate}%</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-orange-400" />
            <span className="text-gray-400 text-sm">Current Streak</span>
          </div>
          <div className="text-2xl font-bold">{user.currentStreak}</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Code className="text-green-400" />
            <span className="text-gray-400 text-sm">Problems Solved</span>
          </div>
          <div className="text-2xl font-bold">{user.totalProblemsSolved}</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-purple-400" />
            <span className="text-gray-400 text-sm">Total Play Time</span>
          </div>
          <div className="text-2xl font-bold">{user.totalPlayTime}h</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-blue-400" />
            <span className="text-gray-400 text-sm">LeetCode Rating</span>
          </div>
          <div className="text-2xl font-bold">
            {user.leetcodeRating}{" "}
            {user.leetcodeVerified && (
              <Check className="inline text-green-400" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-cyan">VP</div>
            <span className="text-gray-400 text-sm">Balance</span>
          </div>
          <div className="text-2xl font-bold">{user.vpBalance}</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-green-400">VP</div>
            <span className="text-gray-400 text-sm">Earned</span>
          </div>
          <div className="text-2xl font-bold">{user.vpLifetimeEarned}</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-red-400">VP</div>
            <span className="text-gray-400 text-sm">Spent</span>
          </div>
          <div className="text-2xl font-bold">{user.vpLifetimeSpent}</div>
        </div>
      </div>
    </div>
  );
}
