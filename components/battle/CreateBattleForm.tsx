"use client";
import { useState } from "react";
import BattleTypeCard from "@/components/battle/BattleTypeCard";
import DifficultyCard from "@/components/battle/DifficultyCard";
import { Timer, Zap, SkipForward, User } from "lucide-react";

export default function CreateBattleForm() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const battleTypes = [
    {
      id: "marathon",
      name: "Marathon",
      description: "Long-form coding battle with complex algorithmic challenges",
      duration: "60 min",
      problems: "4-6 problems",
      entry: "50 VP",
      prize: "200-500 VP",
      icon: <Timer className="h-6 w-6 text-cyan" />,
    },
    {
      id: "sprinter",
      name: "Sprinter",
      description: "Quick coding challenges for rapid problem solving",
      duration: "15 min",
      problems: "2-3 problems",
      entry: "20 VP",
      prize: "60-150 VP",
      icon: <Zap className="h-6 w-6 text-cyan" />,
    },
    {
      id: "pacer",
      name: "Pacer",
      description: "Balanced format mixing speed and complexity",
      duration: "30 min",
      problems: "3-4 problems",
      entry: "30 VP",
      prize: "100-250 VP",
      icon: <SkipForward className="h-6 w-6 text-cyan" />,
    },
    {
      id: "jogger",
      name: "Jogger",
      description: "Steady-paced battles with moderate difficulty",
      duration: "45 min",
      problems: "3-5 problems",
      entry: "40 VP",
      prize: "150-400 VP",
      icon: <User className="h-6 w-6 text-cyan" />,
    },
  ];

  const difficulties = [
    { id: "easy", name: "Easy", reward: "1.0x", color: "text-green-400" },
    { id: "medium", name: "Medium", reward: "1.5x", color: "text-yellow-400" },
    { id: "hard", name: "Hard", reward: "2.0x", color: "text-red-400" },
  ];

  const handleCreateBattle = () => {
    if (!selectedType || !selectedDifficulty) {
      alert("Please select both a battle type and difficulty.");
      return;
    }
    console.log(`Creating battle: ${selectedType} (${selectedDifficulty})`);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-xl mb-4 text-cyan">Select Game Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {battleTypes.map((type) => (
            <BattleTypeCard
              key={type.id}
              type={type}
              isSelected={selectedType === type.id}
              onSelect={() => setSelectedType(type.id)}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-xl mb-4 text-cyan">Select Difficulty</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {difficulties.map((difficulty) => (
            <DifficultyCard
              key={difficulty.id}
              difficulty={difficulty}
              isSelected={selectedDifficulty === difficulty.id}
              onSelect={() => setSelectedDifficulty(difficulty.id)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleCreateBattle}
        className="w-full py-3 bg-cyan text-background font-display text-xl rounded-lg hover:bg-cyan/80 transition-colors"
      >
        ⚔ Create Battle
      </button>
    </div>
  );
}
