"use client";
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import UpcomingBattles from "@/components/dashboard/UpcomingBattles";
import PowerUpInventory from "@/components/dashboard/PowerUpInventory";
import VPTransactions from "@/components/dashboard/VPTransactions";

export default function DashboardPage() {
  // Mock user data - replace with actual API calls
  const userData = {
    username: "CodeWarrior",
    tier: "gold",
    tierPoints: 1250,
    globalRank: 42,
    vpBalance: 2450,
    recentActivity: [
      {
        id: 1,
        type: "battle",
        title: "Won Marathon Battle",
        vpChange: +150,
        date: "2 hours ago",
      },
      {
        id: 2,
        type: "purchase",
        title: "Bought Time Warp",
        vpChange: -200,
        date: "1 day ago",
      },
      {
        id: 3,
        type: "reward",
        title: "Daily Streak Bonus",
        vpChange: +50,
        date: "2 days ago",
      },
      {
        id: 4,
        type: "battle",
        title: "Joined Sprinter Battle",
        vpChange: -20,
        date: "3 days ago",
      },
    ],
    performance: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      wins: [12, 19, 8, 15, 20, 18],
      losses: [8, 5, 12, 7, 3, 6],
    },
    upcomingBattles: [
      {
        id: 1,
        name: "Algorithm Showdown",
        type: "Marathon",
        time: "2 hours",
        entry: 50,
        prize: 500,
      },
      {
        id: 2,
        name: "Quick Code Duel",
        type: "Sprinter",
        time: "Tomorrow",
        entry: 20,
        prize: 200,
      },
      {
        id: 3,
        name: "Weekend Challenge",
        type: "Pacer",
        time: "Sat, 10 AM",
        entry: 30,
        prize: 300,
      },
    ],
    powerUps: [
      { id: 1, name: "Shadow Strike", quantity: 3, icon: "⚡" },
      { id: 2, name: "Time Warp", quantity: 1, icon: "⏳" },
      { id: 3, name: "Mystic Shield", quantity: 2, icon: "🛡" },
    ],
    transactions: [
      {
        id: 1,
        type: "deposit",
        amount: 500,
        date: "2023-06-15",
        description: "Battle Prize",
      },
      {
        id: 2,
        type: "withdrawal",
        amount: -200,
        date: "2023-06-14",
        description: "Power Up Purchase",
      },
      {
        id: 3,
        type: "deposit",
        amount: 50,
        date: "2023-06-13",
        description: "Daily Reward",
      },
    ],
    stats: {
      totalBattles: 47,
      winRate: 68,
      currentStreak: 5,
      problemsSolved: 215,
      playTime: 125,
      vpEarned: 15000,
      vpSpent: 12550,
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader user={userData} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardStats stats={userData.stats} />
            <PerformanceChart performance={userData.performance} />
            <UpcomingBattles battles={userData.upcomingBattles} />
          </div>

          <div className="space-y-8">
            <PowerUpInventory powerUps={userData.powerUps} />
            <VPTransactions transactions={userData.transactions} />
          </div>
        </div>

        <div className="mt-8">
          <RecentActivity activities={userData.recentActivity} />
        </div>
      </div>
    </div>
  );
}
