"use client";
import { useState } from "react";
import {
  Timer,
  Zap,
  SkipForward,
  User,
  Users,
  Lock,
  Globe,
  Shield,
  Calendar,
  Clock,
} from "lucide-react";
import BattleTypeCard from "@/components/battle/BattleTypeCard";
import DifficultyCard from "@/components/battle/DifficultyCard";

export default function CreateBattleForm() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [scheduledStart, setScheduledStart] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>("");
  const [allowSpectators, setAllowSpectators] = useState<boolean>(true);
  const [isBattleRoyale, setIsBattleRoyale] = useState<boolean>(false);
  const [eliminationRounds, setEliminationRounds] = useState<number>(0);

  const battleTypes = [
    {
      id: "marathon",
      name: "Marathon",
      description:
        "Long-form coding battle with complex algorithmic challenges",
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
    console.log({
      type: selectedType,
      difficulty: selectedDifficulty,
      maxPlayers,
      scheduledStart,
      isPrivate,
      inviteCode,
      allowSpectators,
      isBattleRoyale,
      eliminationRounds,
    });
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700 w-full max-w-6xl mx-auto">
      {/* Battle Type Selection */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-lg sm:text-xl mb-3 sm:mb-4 text-cyan">
          Select Game Type
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

      {/* Difficulty Selection */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-lg sm:text-xl mb-3 sm:mb-4 text-cyan">
          Select Difficulty
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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

      {/* Battle Settings Container */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
        <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6 text-cyan">
          Battle Settings
        </h2>

        <div className="space-y-4 sm:space-y-6">
          {/* Max Players - Mobile optimized */}
          <div className="w-full">
            <label className="block text-gray-400 mb-2 font-mono text-sm sm:text-base">
              Max Players
            </label>
            <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2 sm:p-0 sm:bg-transparent">
              <button
                onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}
                className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
              >
                <span className="text-foreground">−</span>
              </button>
              <span className="font-display text-lg text-foreground mx-3 sm:mx-4">
                {maxPlayers}
              </span>
              <button
                onClick={() => setMaxPlayers(maxPlayers + 1)}
                className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
              >
                <span className="text-foreground">+</span>
              </button>
            </div>
          </div>

          {/* Scheduled Start - Mobile optimized */}
          <div className="w-full">
            <label className="block text-gray-400 mb-2 font-mono text-sm sm:text-base">
              Scheduled Start
            </label>
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-2">
              <Calendar className="text-gray-400" size={18} />
              <input
                type="datetime-local"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                className="bg-transparent flex-1 text-foreground text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Toggle Settings - Mobile optimized */}
          <div className="space-y-4">
            {/* Private Battle */}
            <div className="flex flex-col items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="w-full flex flex-row justify-between items-center gap-2">
                <div className="flex flex-row justify-between items-center gap-2">
                  <Lock className="text-gray-400" size={18} />
                  <label className="text-gray-400 font-mono text-sm sm:text-base cursor-pointer">
                    Private Battle
                  </label>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                  className="toggle-checkbox"
                />
              </div>

              {isPrivate && (
                <div className="w-full bg-gray-700 rounded-lg pt-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Invite Code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="bg-gray-600 px-3 py-2 rounded-lg flex-1 text-foreground text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Allow Spectators */}
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="text-gray-400" size={18} />
                <label className="text-gray-400 font-mono text-sm sm:text-base cursor-pointer">
                  Allow Spectators
                </label>
              </div>
              <input
                type="checkbox"
                checked={allowSpectators}
                onChange={() => setAllowSpectators(!allowSpectators)}
                className="toggle-checkbox"
              />
            </div>

            {/* Battle Royale Mode */}
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="text-gray-400" size={18} />
                <label className="text-gray-400 font-mono text-sm sm:text-base cursor-pointer">
                  Battle Royale Mode
                </label>
              </div>
              <input
                type="checkbox"
                checked={isBattleRoyale}
                onChange={() => setIsBattleRoyale(!isBattleRoyale)}
                className="toggle-checkbox"
              />
            </div>

            {/* Elimination Rounds (if Battle Royale) */}
            {isBattleRoyale && (
              <div className="w-full bg-gray-700 rounded-lg p-3">
                <label className="block text-gray-400 mb-2 font-mono text-sm sm:text-base">
                  Elimination Rounds
                </label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      setEliminationRounds(Math.max(1, eliminationRounds - 1))
                    }
                    className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    <span className="text-foreground">−</span>
                  </button>
                  <span className="font-display text-lg text-foreground mx-3 sm:mx-4">
                    {eliminationRounds}
                  </span>
                  <button
                    onClick={() => setEliminationRounds(eliminationRounds + 1)}
                    className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    <span className="text-foreground">+</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Battle Button - Full width on mobile */}
      <button
        onClick={handleCreateBattle}
        className="w-full py-3 bg-cyan text-background font-display text-lg sm:text-xl rounded-lg hover:bg-cyan/80 transition-colors mt-6"
      >
        ⚔ Create Battle
      </button>
    </div>
  );
}
