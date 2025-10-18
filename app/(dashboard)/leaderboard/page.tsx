"use client";
import { useState } from "react";
import LeaderboardHeader from "@/components/leaderboard/LeaderBoardHeader";
import LeaderboardFilters from "@/components/leaderboard/LeaderBoardFilters";
import LeaderboardTopPlayers from "@/components/leaderboard/LeaderBoardTopPlayers";
import LeaderboardTable from "@/components/leaderboard/LeaderBoardTable";

export default function LeaderboardPage() {
  const [timePeriod, setTimePeriod] = useState("30d");
  const [gameType, setGameType] = useState("all");
  const [tier, setTier] = useState("all");

  // Mock data - replace with actual API call
  const topPlayers = [
    {
      id: 2,
      username: "shannon_kautzer",
      rank: 2,
      volume: 1671.57,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAuOywhbJamFQlpYsEvQ3OOiAYOeewJwYcqw&s",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
    },
    {
      id: 1,
      username: "marion_stiedemann",
      rank: 1,
      volume: 1671.57,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Po_OLjQH3rbq4RZ5amr1qbhWnoReDM395Q&s",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
    },
    {
      id: 3,
      username: "arthur_grimes",
      rank: 3,
      volume: 1671.57,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj_UkBWZBjd-K5TxEQuPAUd6Gj7BKFBsR49A&s",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
    },
  ];

  // Mock data - replace with actual API call
  const leaderboardData = [
    {
      rank: "UNRANKED",
      player: "You",
      won: 0.0,
      trades: 0,
      winRate: 0.0,
      volume: 0.0,
      isYou: true,
    },
    {
      rank: 1,
      player: "marion_stiedemann",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
      volume: 0.56,
      isYou: false,
    },
    {
      rank: 2,
      player: "shannon_kautzer",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
      volume: 0.56,
      isYou: false,
    },
    {
      rank: 3,
      player: "arthur_grimes",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
      volume: 0.56,
      isYou: false,
    },
    {
      rank: 4,
      player: "bernadette_mclaughlin",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
      volume: 0.56,
      isYou: false,
    },
    {
      rank: 5,
      player: "alberta_spencer",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
      volume: 0.56,
      isYou: false,
    },
    {
      rank: 6,
      player: "leo_ruecker",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
      volume: 0.56,
      isYou: false,
    },
    {
      rank: 7,
      player: "rudolph_boehm",
      won: 2.0,
      trades: 5,
      winRate: 34.07,
      volume: 0.56,
      isYou: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <LeaderboardHeader />

        {/* <div className="mt-6">
          <LeaderboardFilters
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            gameType={gameType}
            setGameType={setGameType}
            tier={tier}
            setTier={setTier}
          />
        </div> */}

        <div className="mt-8 relative">
          <LeaderboardTopPlayers players={topPlayers} />
        </div>

        <div>
          <LeaderboardTable data={leaderboardData} />
        </div>
      </div>
    </div>
  );
}
