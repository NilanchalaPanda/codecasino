interface BattleOverviewProps {
  battle: {
    description: string;
  };
}

export default function BattleOverview({ battle }: BattleOverviewProps) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-4">
        Battle Description
      </h2>
      <p className="text-gray-300 leading-relaxed">{battle.description}</p>
    </div>
  );
}
