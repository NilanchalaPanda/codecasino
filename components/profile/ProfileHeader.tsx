import { Crown, Check, User, Calendar, Award } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    displayName: string;
    avatarUrl: string;
    bio: string;
    country: string;
    tier: string;
    tierPoints: number;
    globalRank: number;
    isPremium: boolean;
    premiumUntil: string;
    createdAt: string;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
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
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src="https://media.licdn.com/dms/image/v2/C4D03AQEeEyYzNtDq7g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1524234561685?e=2147483647&v=beta&t=uHzeaBv3V2z6Tp6wvhzGABlTs9HR-SP-tEX1UbYNn4Q"
            alt={user.displayName}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
          />
          <div className="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-1 border-2 border-gray-700">
            <Crown className={`w-6 h-6 ${getTierColor(user.tier)}`} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-display text-2xl sm:text-3xl">
              {user.displayName}
            </h1>
            {user.isPremium && (
              <span className="bg-cyan/20 text-cyan px-2 py-1 rounded-full text-xs font-mono">
                PREMIUM
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <User className="w-4 h-4" />
              <span>{user.country}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Award className={`w-4 h-4 ${getTierColor(user.tier)}`} />
              <span className={getTierColor(user.tier)}>
                {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}{" "}
                {user.tierPoints} TP
              </span>
            </div>
            {/* <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div> */}
          </div>

          <p className="text-gray-400 mb-4">{user.bio}</p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              Rank #{user.globalRank}
            </div>
            {user.isPremium && (
              <div className="bg-cyan/20 text-cyan px-3 py-1 rounded-full text-sm">
                Premium until {new Date(user.premiumUntil).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
