interface BattleProgressProps {
  battle: {
    currentPlayers: number;
    maxPlayers: number;
  };
}

export default function BattleProgress({ battle }: BattleProgressProps) {
  const progress = (battle.currentPlayers / battle.maxPlayers) * 100;

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-4">Battle Progress</h2>
      <div className="mb-2 flex justify-between text-sm">
        <span>Participants</span>
        <span>
          {battle.currentPlayers}/{battle.maxPlayers} ({Math.round(progress)}%)
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full h-3"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
