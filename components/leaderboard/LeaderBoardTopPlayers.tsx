interface Player {
  id: number;
  username: string;
  rank: number;
  volume: number;
  avatar: string;
  won: number;
  trades: number;
  winRate: number;
}

interface LeaderboardTopPlayersProps {
  players: Player[];
}

export default function LeaderboardTopPlayers({
  players,
}: LeaderboardTopPlayersProps) {
  return (
    <div className="relative">
      {/* Podium structure */}
      <div className="absolute inset-0 flex justify-center items-end pointer-events-none">
        {/* Podium base */}
        <div className="w-[90%] max-w-4xl h-32 bg-gray-800/70 rounded-t-xl border-t border-x border-gray-700 flex">
          <div className="w-1/3 border-r border-gray-700"></div>
          <div className="w-1/3 border-r border-gray-700"></div>
          <div className="w-1/3"></div>
        </div>

        {/* Podium steps */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl h-40 flex">
          <div className="w-1/3 flex justify-center">
            <div className="h-20 w-24 bg-gray-700/50 rounded-t-lg border-t border-l border-r border-gray-600"></div>
          </div>
          <div className="w-1/3 flex justify-center">
            <div className="h-32 w-32 bg-gray-700/50 rounded-t-lg border-t border-l border-r border-gray-600"></div>
          </div>
          <div className="w-1/3 flex justify-center">
            <div className="h-24 w-24 bg-gray-700/50 rounded-t-lg border-t border-l border-r border-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Players on podium */}
      <div className="relative flex justify-center px-4 sm:px-0">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`flex flex-col items-center z-${10 + (3 - index) * 10} ${
              index === 0
                ? "w-1/3"
                : index === 1
                ? "w-1/3 -mt-4"
                : "w-1/3 -mt-8"
            }`}
          >
            <div className="relative">
              {/* Rank badge for mobile */}
              <div
                className="sm:hidden absolute -top-2 -left-2 bg-gray-900 px-2 py-1 rounded-full text-xs font-bold"
                style={{
                  color:
                    index === 0
                      ? "#d4af37"
                      : index === 1
                      ? "#a7a7ad"
                      : index === 2
                      ? "#cd7f32"
                      : "#fff",
                }}
              >
                #{player.rank}
              </div>

              {/* Player avatar with border based on rank */}
              <div
                className={`rounded-lg border-4 overflow-hidden ${
                  index === 0
                    ? "border-yellow-400"
                    : index === 1
                    ? "border-gray-300"
                    : "border-yellow-600"
                }`}
                style={{
                  width: index === 0 ? "120px" : index === 1 ? "100px" : "90px",
                  height:
                    index === 0 ? "120px" : index === 1 ? "100px" : "90px",
                }}
              >
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rank badge for desktop */}
              <div
                className="hidden sm:block absolute -top-2 -right-2 bg-gray-900 px-2 py-1 rounded-full text-xs font-bold"
                style={{
                  color:
                    index === 0
                      ? "#d4af37"
                      : index === 1
                      ? "#a7a7ad"
                      : index === 2
                      ? "#cd7f32"
                      : "#fff",
                }}
              >
                #{player.rank}
              </div>
            </div>

            <div className="mt-2 text-center">
              <div className="font-display text-sm sm:text-base text-gray-300">
                {player.username}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-cyan">$</span>
                <span className="text-yellow-400 font-mono text-sm">
                  {player.volume.toFixed(2)}
                </span>
                <span className="text-gray-400 text-xs">VOLUME</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
