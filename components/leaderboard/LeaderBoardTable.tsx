interface LeaderboardEntry {
  rank: number | string;
  player: string;
  won: number;
  trades: number;
  winRate: number;
  volume: number;
  isYou: boolean;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-gray-400 text-xs sm:text-sm font-mono">
              RANK
            </th>
            <th className="px-4 py-3 text-left text-gray-400 text-xs sm:text-sm font-mono">
              PLAYER
            </th>
            <th className="px-4 py-3 text-left text-gray-400 text-xs sm:text-sm font-mono">
              WON
            </th>
            <th className="px-4 py-3 text-left text-gray-400 text-xs sm:text-sm font-mono">
              TRADES
            </th>
            <th className="px-4 py-3 text-left text-gray-400 text-xs sm:text-sm font-mono">
              WIN RATE
            </th>
            <th className="px-4 py-3 text-left text-gray-400 text-xs sm:text-sm font-mono">
              VOLUME
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr
              key={index}
              className={`border-b border-gray-700/50 ${
                entry.isYou ? "bg-gray-700/30" : "hover:bg-gray-700/20"
              }`}
            >
              <td className="px-4 py-3">
                {entry.rank === "UNRANKED" ? (
                  <span className="text-gray-400 text-xs sm:text-sm">
                    UNRANKED
                  </span>
                ) : (
                  <span
                    className={`text-sm sm:text-base ${
                      entry.rank === 1
                        ? "text-yellow-400"
                        : entry.rank === 2
                        ? "text-gray-300"
                        : entry.rank === 3
                        ? "text-yellow-600"
                        : "text-gray-400"
                    }`}
                  >
                    #{entry.rank}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {entry.isYou ? (
                  <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs sm:text-sm">
                    You
                  </span>
                ) : (
                  <span className="text-gray-300 text-xs sm:text-sm">
                    {entry.player}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="text-cyan text-xs sm:text-sm">$</span>
                  <span className="text-gray-300 text-xs sm:text-sm">
                    {entry.won.toFixed(2)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-300 text-xs sm:text-sm">
                  {entry.trades}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-300 text-xs sm:text-sm">
                  {entry.winRate.toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="text-cyan text-xs sm:text-sm">$</span>
                  <span className="text-gray-300 text-xs sm:text-sm">
                    {entry.volume.toFixed(2)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
