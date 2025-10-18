"use client";

import { useRouter } from "next/navigation";

interface BattleCardProps {
  battle: {
    id: string;
    type: string;
    difficulty: string;
    entryFee: string;
    prizePool: string;
    players: string;
    time: string;
    status: string;
  };
}

export default function BattleCard({ battle }: BattleCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/battle/${battle.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 transition-all duration-300 hover:border-cyan cursor-pointer"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-display text-xl text-cyan">{battle.type}</h3>
        <span
          className={`text-sm ${
            battle.difficulty === "Easy"
              ? "text-green-400"
              : battle.difficulty === "Medium"
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {battle.difficulty}
        </span>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Entry:</span>
          <span className="text-yellow-400">{battle.entryFee}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Prize:</span>
          <span className="text-yellow-400">{battle.prizePool}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Players:</span>
          <span className="text-cyan">{battle.players}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">{battle.time}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // 👈 prevent navigating when clicking button
            router.push(`/battle/${battle.id}`);
          }}
          className="px-4 py-1 bg-cyan text-background rounded-md text-sm font-mono hover:bg-cyan/80 transition-colors"
        >
          Join
        </button>
      </div>
    </div>
  );
}
