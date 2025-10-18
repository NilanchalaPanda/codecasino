interface Difficulty {
  id: string;
  name: string;
  reward: string;
  color: string;
}

interface DifficultyCardProps {
  difficulty: Difficulty;
  isSelected: boolean;
  onSelect: () => void;
}

export default function DifficultyCard({
  difficulty,
  isSelected,
  onSelect,
}: DifficultyCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`border-2 p-4 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "border-cyan bg-gray-800"
          : "border-gray-700 hover:border-cyan"
      }`}
    >
      <h3 className={`font-display text-xl mb-2 ${difficulty.color}`}>
        {difficulty.name}
      </h3>
      <p className="text-gray-400 text-sm">
        Reward: <span className={difficulty.color}>{difficulty.reward}</span>
      </p>
    </div>
  );
}
