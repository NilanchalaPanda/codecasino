import BattleHero from "@/components/battle/BattleHero";
import CreateBattlePage from "@/components/battle/CreateBattle";
import React from "react";

const page = () => {
  return (
    <div>
      <BattleHero />
      <CreateBattlePage />
    </div>
  );
};

export default page;
