"use client";
import {
  Bell,
  Crown,
  Swords,
  Code2,
  User,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

const notifications = [
  {
    id: 1,
    type: "battle",
    title: "New Battle Challenge",
    message:
      "You've been challenged to a 'Sprinter' battle by @DevMaster. Accept now!",
    time: "2 mins ago",
    icon: <Swords className="h-5 w-5 text-cyan" />,
    read: false,
  },
  {
    id: 2,
    type: "reward",
    title: "Victory Points Earned",
    message:
      "You earned 500 VP for completing the 'Marathon' challenge. Keep it up!",
    time: "1 hour ago",
    icon: <Crown className="h-5 w-5 text-orange-accent" />,
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Battle Reminder",
    message: "Your 'Jogger' battle starts in 10 minutes. Don't miss it!",
    time: "3 hours ago",
    icon: <AlertTriangle className="h-5 w-5 text-orange-accent" />,
    read: true,
  },
  {
    id: 4,
    type: "achievement",
    title: "New Achievement Unlocked",
    message:
      "You've unlocked the 'Algorithm Master' badge. Check it out in your profile!",
    time: "1 day ago",
    icon: <Code2 className="h-5 w-5 text-cyan" />,
    read: true,
  },
  {
    id: 5,
    type: "social",
    title: "New Follower",
    message: "@CodeWarrior123 is now following you. Follow them back!",
    time: "2 days ago",
    icon: <User className="h-5 w-5 text-cyan" />,
    read: true,
  },
];

const filters = [
  "All",
  "Battles",
  "Rewards",
  "Alerts",
  "Achievements",
  "Social",
];

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notificationsList, setNotificationsList] = useState(notifications);

  const markAsRead = (id: number) => {
    setNotificationsList(
      notificationsList.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const filteredNotifications =
    activeFilter === "All"
      ? notificationsList
      : notificationsList.filter((notification) => {
          switch (activeFilter) {
            case "Battles":
              return notification.type === "battle";
            case "Rewards":
              return notification.type === "reward";
            case "Alerts":
              return notification.type === "alert";
            case "Achievements":
              return notification.type === "achievement";
            case "Social":
              return notification.type === "social";
            default:
              return true;
          }
        });

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-10 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-cyan">
            Notifications
          </h1>
          <button className="flex items-center gap-2 text-sm font-mono text-secondary hover:text-cyan transition">
            <Check className="h-4 w-4" /> Mark All as Read
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-mono transition",
                activeFilter === filter
                  ? "bg-cyan text-gray-900"
                  : "bg-gray-800 text-secondary hover:bg-gray-700 hover:text-cyan"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-secondary">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-700" />
              <p>No notifications found.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={clsx(
                  "p-4 rounded-lg border border-gray-800 hover:border-cyan transition flex items-start gap-4",
                  !notification.read ? "bg-gray-800/50" : "bg-gray-800/30"
                )}
              >
                <div className="mt-1">{notification.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-foreground">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-secondary">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-secondary text-sm mt-1">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-secondary hover:text-cyan transition"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
