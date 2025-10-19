import { Clock, Trophy, Users, Gem } from "lucide-react";

interface Battle {
  id: number;
  name: string;
  type: string;
  time: string;
  entry: number;
  prize: number;
}

interface UpcomingBattlesProps {
  battles: Battle[];
}

export default function UpcomingBattles({ battles }: UpcomingBattlesProps) {
  const getBattleTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "marathon":
        return <Clock className="text-purple-400 h-5 w-5" />;
      case "sprinter":
        return <Trophy className="text-yellow-400 h-5 w-5" />;
      case "pacer":
        return <Users className="text-cyan h-5 w-5" />;
      default:
        return <Gem className="text-green-400 h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl text-cyan">Upcoming Battles</h2>
        <button className="px-4 py-2 bg-cyan/20 text-cyan rounded-lg text-sm hover:bg-cyan/30 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {battles.map((battle) => (
          <div
            key={battle.id}
            className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {getBattleTypeIcon(battle.type)}
                <div>
                  <h3 className="font-semibold">{battle.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <span>{battle.type}</span>
                    <span>•</span>
                    <span>{battle.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-cyan font-semibold">
                  {battle.prize} $
                </div>
                <div className="text-xs text-gray-400">Prize Pool</div>
                <div className="flex items-center gap-4 mt-2">
                  <button className="px-3 py-1 bg-cyan/20 text-cyan rounded-full text-xs hover:bg-cyan/30 transition-colors">
                    Join ({battle.entry})
                  </button>
                  <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
