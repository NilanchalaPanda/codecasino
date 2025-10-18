import { BarChart3 } from "lucide-react";

interface LeaderboardPosition {
  period: string;
  rank: number;
  totalPlayers: number;
  gamesPlayed: number;
}

export default function ProfileLeaderboard({ user }: { user: any }) {
  // Mock data - replace with actual data fetching
  const leaderboardPositions: LeaderboardPosition[] = [
    {
      period: "This Week",
      rank: 3,
      totalPlayers: 1250,
      gamesPlayed: 5,
    },
    {
      period: "This Month",
      rank: 12,
      totalPlayers: 5800,
      gamesPlayed: 18,
    },
    {
      period: "All Time",
      rank: 42,
      totalPlayers: 24500,
      gamesPlayed: 47,
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-6">Leaderboard</h2>

      <div className="space-y-4">
        {leaderboardPositions.map((position, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{position.period}</h3>
                <p className="text-gray-400 text-sm">
                  Rank #{position.rank} of {position.totalPlayers}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="text-cyan" size={16} />
                <span className="text-sm">{position.gamesPlayed} games</span>
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-cyan rounded-full h-2"
                style={{
                  width: `${(position.rank / position.totalPlayers) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="px-4 py-2 bg-cyan/20 text-cyan rounded-lg hover:bg-cyan/30 transition-colors">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
}
