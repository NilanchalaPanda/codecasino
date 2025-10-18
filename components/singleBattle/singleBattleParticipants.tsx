import { Users, Crown, Shield, Code } from "lucide-react";

interface BattleParticipantsProps {
  battle: {
    currentPlayers: number;
    maxPlayers: number;
  };
}

export default function BattleParticipants({
  battle,
}: BattleParticipantsProps) {
  // Mock participant data - replace with actual API call
  const participants = [
    {
      id: 1,
      username: "Shado",
      rank: 1,
      tier: "diamond",
      vp: 5200,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Po_OLjQH3rbq4RZ5amr1qbhWnoReDM395Q&s",
    },
    {
      id: 2,
      username: "AlgoMaster",
      rank: 2,
      tier: "platinum",
      vp: 4800,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAuOywhbJamFQlpYsEvQ3OOiAYOeewJwYcqw&s",
    },
    {
      id: 3,
      username: "CodeNinja",
      rank: 3,
      tier: "gold",
      vp: 4500,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Po_OLjQH3rbq4RZ5amr1qbhWnoReDM395Q&s",
    },
    {
      id: 4,
      username: "BinaryBandit",
      rank: 4,
      tier: "gold",
      vp: 4200,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj_UkBWZBjd-K5TxEQuPAUd6Gj7BKFBsR49A&s",
    },
    {
      id: 5,
      username: "LoopLegend",
      rank: 5,
      tier: "silver",
      vp: 3900,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAuOywhbJamFQlpYsEvQ3OOiAYOeewJwYcqw&s",
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "diamond":
        return "text-cyan-400";
      case "platinum":
        return "text-blue-400";
      case "gold":
        return "text-yellow-400";
      case "silver":
        return "text-gray-300";
      case "bronze":
        return "text-orange-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl text-cyan">
          Participants ({battle.currentPlayers}/{battle.maxPlayers})
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="h-4 w-4" />
          <span>{battle.currentPlayers} Warriors Joined</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-gray-400 text-xs font-mono">
                RANK
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-xs font-mono">
                PLAYER
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-xs font-mono">
                TIER
              </th>
              <th className="px-4 py-3 text-left text-gray-400 text-xs font-mono">
                VP
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr
                key={participant.id}
                className="border-b border-gray-700/50 hover:bg-gray-700/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {participant.rank === 1 && (
                      <Crown className="text-yellow-400 h-4 w-4" />
                    )}
                    {participant.rank === 2 && (
                      <Shield className="text-gray-300 h-4 w-4" />
                    )}
                    {participant.rank === 3 && (
                      <Code className="text-yellow-600 h-4 w-4" />
                    )}
                    <span className="font-mono">{participant.rank}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={participant.avatar}
                      alt={participant.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-mono">{participant.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono capitalize ${getTierColor(
                      participant.tier
                    )}`}
                  >
                    {participant.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono">{participant.vp} VP</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
