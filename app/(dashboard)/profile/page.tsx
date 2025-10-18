"use client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileActivity from "@/components/profile/ProfileActivity";
import ProfilePowerUps from "@/components/profile/ProfilePowerUps";
import ProfileLeaderboard from "@/components/profile/ProfileLeaderBoard";
import ProfileRecentBattles from "@/components/profile/ProfileRecentBattles";

export default function ProfilePage() {
  // Mock user data - replace with actual data fetching
  const userData = {
    id: "123",
    displayName: "CodeWarrior",
    avatarUrl: "/avatars/default.png",
    bio: "Competitive programmer and algorithm enthusiast",
    country: "USA",
    tier: "gold",
    tierPoints: 1250,
    globalRank: 42,
    leetcodeUsername: "codewarrior123",
    leetcodeRating: 2100,
    leetcodeVerified: true,
    vpBalance: 2450,
    vpLifetimeEarned: 15000,
    vpLifetimeSpent: 12550,
    totalGames: 47,
    gamesWon: 32,
    gamesLost: 15,
    totalProblemsSolved: 215,
    totalPlayTime: 125, // in hours
    currentStreak: 5,
    longestStreak: 12,
    isPremium: true,
    premiumUntil: "2025-12-31",
    createdAt: "2023-01-15",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader user={userData} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProfileStats user={userData} />
            <ProfileActivity userId={userData.id} />
          </div>

          <div className="space-y-8">
            <ProfilePowerUps userId={userData.id} />
            <ProfileLeaderboard user={userData} />
          </div>
        </div>

        <div className="mt-8">
          <ProfileRecentBattles userId={userData.id} />
        </div>
      </div>
    </div>
  );
}
