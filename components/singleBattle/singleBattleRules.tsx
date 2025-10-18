import { Trophy, Clock, Code, ShieldCheck, Users, Gem } from "lucide-react";

interface BattleRulesProps {
  battle: {
    gameType: string;
    questions: number;
    timeLimit: number;
    entryFee: number;
    prizePool: number;
    difficulty: string;
    currency: string;
  };
}

export default function BattleRules({ battle }: BattleRulesProps) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-6">Rules & Prizes</h2>

      <div className="space-y-6">
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold text-cyan mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Prize Distribution
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>
              1st Place: 50% of prize pool ({Math.round(battle.prizePool * 0.5)}{" "}
              {battle.currency})
            </li>
            <li>
              2nd Place: 30% of prize pool ({Math.round(battle.prizePool * 0.3)}{" "}
              {battle.currency})
            </li>
            <li>
              3rd Place: 15% of prize pool (
              {Math.round(battle.prizePool * 0.15)} {battle.currency})
            </li>
            <li>
              4th-8th Place: 5% of prize pool each (
              {Math.round(battle.prizePool * 0.05)} {battle.currency})
            </li>
          </ul>
        </div>

        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold text-cyan mb-2 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Battle Rules
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>
              Entry fee: {battle.entryFee} {battle.currency} (non-refundable)
            </li>
            <li>Duration: {battle.timeLimit} minutes</li>
            <li>Number of problems: {battle.questions}</li>
            <li>Difficulty: {battle.difficulty}</li>
            <li>Minimum participants required: 8</li>
            <li>No external help or resources allowed</li>
            <li>All submissions must be original work</li>
            <li>Cheating will result in immediate disqualification</li>
          </ul>
        </div>

        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold text-cyan mb-2 flex items-center gap-2">
            <Code className="h-5 w-5" />
            Scoring System
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Points awarded for correct solutions</li>
            <li>Faster solutions receive bonus points</li>
            <li>Penalties for incorrect submissions</li>
            <li>Final ranking based on total points</li>
            <li>Tie-breaker: submission time for last solved problem</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
