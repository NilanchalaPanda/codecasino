import { Crown, User, Calendar } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    username: string;
    tier: string;
    tierPoints: number;
    globalRank: number;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return "text-orange-500";
      case "silver":
        return "text-gray-300";
      case "gold":
        return "text-yellow-400";
      case "platinum":
        return "text-blue-400";
      case "diamond":
        return "text-cyan-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border-2 border-gray-700">
              <Crown className={`w-5 h-5 ${getTierColor(user.tier)}`} />
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl mb-1">
              Welcome, {user.username}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className={`${getTierColor(user.tier)}`}>●</span>
                <span className={getTierColor(user.tier)}>
                  {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Tier
                </span>
                <span className="text-gray-400">({user.tierPoints} TP)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Global Rank #{user.globalRank}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
