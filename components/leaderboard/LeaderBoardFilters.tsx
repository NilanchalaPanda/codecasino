interface LeaderboardFiltersProps {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  gameType: string;
  setGameType: (type: string) => void;
  tier: string;
  setTier: (tier: string) => void;
}

export default function LeaderboardFilters({
  timePeriod,
  setTimePeriod,
  gameType,
  setGameType,
  tier,
  setTier,
}: LeaderboardFiltersProps) {
  const timePeriods = ["24h", "7d", "30d", "all-time"];
  const gameTypes = ["all", "marathon", "sprinter", "pacer", "jogger"];
  const tiers = ["all", "bronze", "silver", "gold", "platinum", "diamond"];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-gray-400 font-mono text-sm">Time:</span>
        {timePeriods.map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${
              timePeriod === period
                ? "bg-cyan text-background"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-gray-400 font-mono text-sm">Game:</span>
        <button
          onClick={() => setGameType("all")}
          className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${
            gameType === "all"
              ? "bg-cyan text-background"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          All Types
        </button>
        {gameTypes
          .filter((t) => t !== "all")
          .map((type) => (
            <button
              key={type}
              onClick={() => setGameType(type)}
              className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${
                gameType === type
                  ? "bg-cyan text-background"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-gray-400 font-mono text-sm">Tier:</span>
        <button
          onClick={() => setTier("all")}
          className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${
            tier === "all"
              ? "bg-cyan text-background"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          All Tiers
        </button>
        {tiers
          .filter((t) => t !== "all")
          .map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${
                tier === t
                  ? "bg-cyan text-background"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
      </div>
    </div>
  );
}
