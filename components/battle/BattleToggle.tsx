interface BattleToggleProps {
  isCreatingBattle: boolean;
  setIsCreatingBattle: (value: boolean) => void;
}

export default function BattleToggle({
  isCreatingBattle,
  setIsCreatingBattle,
}: BattleToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-800 rounded-lg p-1 flex">
        <button
          onClick={() => setIsCreatingBattle(false)}
          className={`px-6 py-2 rounded-md font-mono text-sm transition-colors ${
            !isCreatingBattle
              ? "bg-cyan text-background"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Join Battle
        </button>
        <button
          onClick={() => setIsCreatingBattle(true)}
          className={`px-6 py-2 rounded-md font-mono text-sm transition-colors ${
            isCreatingBattle
              ? "bg-cyan text-background"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Create Battle
        </button>
      </div>
    </div>
  );
}
