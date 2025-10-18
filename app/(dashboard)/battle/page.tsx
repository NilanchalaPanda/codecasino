"use client";
import { useState } from "react";
import BattleHero from "@/components/battle/BattleHero";
import BattleToggle from "@/components/battle/BattleToggle";
import BattleSearchBar from "@/components/battle/BattleSearchBar";
import BattleList from "@/components/battle/BattleList";
import CreateBattleForm from "@/components/battle/CreateBattleForm";

export default function BattlePage() {
  const [isCreatingBattle, setIsCreatingBattle] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BattleHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BattleToggle
          isCreatingBattle={isCreatingBattle}
          setIsCreatingBattle={setIsCreatingBattle}
        />
        {isCreatingBattle ? (
          <CreateBattleForm />
        ) : (
          <>
            <BattleSearchBar />
            <BattleList />
          </>
        )}
      </div>
    </div>
  );
}
