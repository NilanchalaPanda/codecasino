import { Clock, Gem, Users, ShieldCheck, Code, Trophy } from "lucide-react";

interface BattleStatsProps {
  battle: {
    gameType: string;
    questions: number;
    timeLimit: number;
    entryFee: number;
    prizePool: number;
    minPlayers: number;
    difficulty: string;
    currency: string;
  };
}

export default function BattleStats({ battle }: BattleStatsProps) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-4">Battle Stats</h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="text-purple-400 h-5 w-5" />
            <span>Game Type</span>
          </div>
          <span className="font-mono">{battle.gameType}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="text-green-400 h-5 w-5" />
            <span>Questions</span>
          </div>
          <span className="font-mono">{battle.questions}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-400 h-5 w-5" />
            <span>Time Limit</span>
          </div>
          <span className="font-mono">{battle.timeLimit} min</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gem className="text-yellow-400 h-5 w-5" />
            <span>Entry Fee</span>
          </div>
          <span className="font-mono">
            {battle.entryFee} {battle.currency}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="text-cyan h-5 w-5" />
            <span>Prize Pool</span>
          </div>
          <span className="font-mono">
            {battle.prizePool} {battle.currency}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="text-blue-400 h-5 w-5" />
            <span>Min Players</span>
          </div>
          <span className="font-mono">{battle.minPlayers}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-red-400 h-5 w-5" />
            <span>Difficulty</span>
          </div>
          <span className="font-mono capitalize">{battle.difficulty}</span>
        </div>
      </div>
    </div>
  );
}
