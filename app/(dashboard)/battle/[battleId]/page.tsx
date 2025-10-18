"use client";
import { useState } from "react";

import BattleHeader from "@/components/singleBattle/singleBattleHeader";
import BattleTabs from "@/components/singleBattle/singleBattleTabs";
import BattleOverview from "@/components/singleBattle/singleBattleOverview";
import BattleParticipants from "@/components/singleBattle/singleBattleParticipants";
import BattleRules from "@/components/singleBattle/singleBattleRules";
import BattleProgress from "@/components/singleBattle/singleBattleProgress";
import BattleStats from "@/components/singleBattle/singleBattleStats";

import { ArrowLeft, MessageCircle } from "lucide-react";

export default function BattlePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock battle data - replace with actual API call
  const battleData = {
    id: "midnight-duel-1",
    title: "Midnight Duel Championship",
    status: "waiting",
    description:
      "A legendary battle where only the most skilled warriors dare to compete. Face challenging algorithmic problems under time pressure while competing against elite programmers from around the world. This championship will test your problem-solving skills, speed, and mental fortitude.",
    prizePool: 2500,
    entryFee: 100,
    maxPlayers: 32,
    currentPlayers: 24,
    difficulty: "hard",
    gameType: "Endurance Test",
    questions: 5,
    timeLimit: 180,
    createdBy: "Shado",
    minPlayers: 8,
    startTime: new Date(Date.now() + 3600000),
    duration: 180,
    currency: "Crystals",
  };

  return (
    <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto">
      {/* Back navigation */}
      <div className="container mx-auto px-4 py-6">
        <button className="flex items-center gap-2 text-gray-400 hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Battles</span>
        </button>

        {/* Battle Header */}
        <BattleHeader battle={battleData} />

        {/* Tabs */}
        <BattleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <BattleOverview battle={battleData} />
                <BattleProgress battle={battleData} />
              </div>
              <div className="space-y-6">
                <BattleStats battle={battleData} />
              </div>
            </div>
          )}

          {activeTab === "participants" && (
            <BattleParticipants battle={battleData} />
          )}

          {activeTab === "rules" && <BattleRules battle={battleData} />}
        </div>
      </div>
    </div>
  );
}
