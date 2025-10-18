interface BattleType {
  id: string;
  name: string;
  description: string;
  duration: string;
  problems: string;
  entry: string;
  prize: string;
  icon: React.ReactNode;
}

interface BattleTypeCardProps {
  type: BattleType;
  isSelected: boolean;
  onSelect: () => void;
}

export default function BattleTypeCard({
  type,
  isSelected,
  onSelect,
}: BattleTypeCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`border-2 p-4 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "border-cyan bg-gray-800"
          : "border-gray-700 hover:border-cyan"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-gray-700">{type.icon}</div>
        <h3 className="font-display text-xl">{type.name}</h3>
      </div>
      <p className="text-gray-400 text-sm mb-3">{type.description}</p>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">Duration:</span>
        <span className="text-cyan">{type.duration}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Problems:</span>
        <span className="text-cyan">{type.problems}</span>
      </div>
      <div className="flex justify-between text-sm mt-2">
        <span className="text-gray-400">Entry:</span>
        <span className="text-yellow-400">{type.entry}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Prize:</span>
        <span className="text-yellow-400">{type.prize}</span>
      </div>
    </div>
  );
}
