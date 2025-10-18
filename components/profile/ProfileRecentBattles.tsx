import { Swords, Trophy, Clock, Users, Zap } from "lucide-react";

interface Battle {
  id: string;
  type: string;
  difficulty: string;
  result: "win" | "loss" | "draw";
  rank: number;
  totalPlayers: number;
  vpChange: number;
  date: string;
  duration: string;
}

export default function ProfileRecentBattles({ userId }: { userId: string }) {
  // Mock data - replace with actual data fetching
  const battles: Battle[] = [
    {
      id: "1",
      type: "Marathon",
      difficulty: "Hard",
      result: "win",
      rank: 1,
      totalPlayers: 8,
      vpChange: 150,
      date: "2025-10-15",
      duration: "60 min",
    },
    {
      id: "2",
      type: "Sprinter",
      difficulty: "Medium",
      result: "win",
      rank: 2,
      totalPlayers: 6,
      vpChange: 80,
      date: "2025-10-14",
      duration: "15 min",
    },
    {
      id: "3",
      type: "Pacer",
      difficulty: "Medium",
      result: "loss",
      rank: 3,
      totalPlayers: 5,
      vpChange: -30,
      date: "2025-10-13",
      duration: "30 min",
    },
    {
      id: "4",
      type: "Jogger",
      difficulty: "Easy",
      result: "win",
      rank: 1,
      totalPlayers: 4,
      vpChange: 60,
      date: "2025-10-12",
      duration: "45 min",
    },
  ];

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "text-green-400";
      case "loss":
        return "text-red-400";
      case "draw":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "win":
        return <Trophy className="text-green-400" />;
      case "loss":
        return <Swords className="text-red-400" />;
      case "draw":
        return <Users className="text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-6">Recent Battles</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-mono">
                Type
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-mono">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-mono">
                Result
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-mono">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-mono">
                VP Change
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-mono">
                Date
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-mono">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {battles.map((battle) => (
              <tr
                key={battle.id}
                className="border-b border-gray-700 hover:bg-gray-700/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {battle.type === "Marathon" && (
                      <Clock className="text-cyan" size={16} />
                    )}
                    {battle.type === "Sprinter" && (
                      <Zap className="text-cyan" size={16} />
                    )}
                    {battle.type === "Pacer" && (
                      <Users className="text-cyan" size={16} />
                    )}
                    {battle.type === "Jogger" && (
                      <Swords className="text-cyan" size={16} />
                    )}
                    <span>{battle.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      battle.difficulty === "Easy"
                        ? "text-green-400"
                        : battle.difficulty === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {battle.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {getResultIcon(battle.result)}
                    <span className={getResultColor(battle.result)}>
                      {battle.result.charAt(0).toUpperCase() +
                        battle.result.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {battle.rank}/{battle.totalPlayers}
                </td>
                <td
                  className={`px-4 py-3 ${
                    battle.vpChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {battle.vpChange >= 0
                    ? `+${battle.vpChange}`
                    : battle.vpChange}{" "}
                  VP
                </td>
                <td className="px-4 py-3">
                  {new Date(battle.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{battle.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
