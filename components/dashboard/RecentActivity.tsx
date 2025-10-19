import { Activity, Trophy, ShoppingBag, Gift } from "lucide-react";

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  vpChange: number;
  date: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "battle":
        return <Trophy className="text-yellow-400 h-5 w-5" />;
      case "purchase":
        return <ShoppingBag className="text-cyan h-5 w-5" />;
      case "reward":
        return <Gift className="text-green-400 h-5 w-5" />;
      default:
        return <Activity className="text-gray-400 h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold">{activity.title}</h3>
                <span className="text-gray-400 text-xs">{activity.date}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`text-sm ${
                    activity.vpChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {activity.vpChange >= 0 ? "+" : ""}
                  {activity.vpChange} VP
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
