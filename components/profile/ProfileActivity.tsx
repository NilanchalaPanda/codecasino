import { Activity, Clock, Code, Trophy } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "battle" | "achievement" | "reward";
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  color: string;
}

export default function ProfileActivity({ userId }: { userId: string }) {
  // Mock data - replace with actual data fetching
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "battle",
      title: "Won Marathon Battle",
      description: "Defeated 7 opponents in a 60-minute algorithm challenge",
      date: "2 hours ago",
      icon: <Trophy className="text-yellow-400" />,
      color: "text-yellow-400",
    },
    {
      id: "2",
      type: "achievement",
      title: "Problem Solving Master",
      description: "Solved 50 problems in a single week",
      date: "1 day ago",
      icon: <Code className="text-green-400" />,
      color: "text-green-400",
    },
    {
      id: "3",
      type: "reward",
      title: "Daily Streak Bonus",
      description: "Earned 50 VP for 5-day streak",
      date: "2 days ago",
      icon: <Activity className="text-cyan" />,
      color: "text-cyan",
    },
    {
      id: "4",
      type: "battle",
      title: "Joined Sprinter Battle",
      description: "Participated in a quick 15-minute coding challenge",
      date: "3 days ago",
      icon: <Clock className="text-purple-400" />,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 bg-gray-700 rounded-lg"
          >
            <div className={`mt-1 ${activity.color}`}>{activity.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold">{activity.title}</h3>
                <span className="text-gray-400 text-xs">{activity.date}</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
