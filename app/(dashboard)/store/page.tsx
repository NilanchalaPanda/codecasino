"use client";
import { useState } from "react";
import StoreHero from "@/components/store/StoreHero";
import StoreTabs from "@/components/store/StoreTabs";
import PowerUpsTab from "@/components/store/PowerUpsTabs";
import BundlesTab from "@/components/store/BundlesTab";
import SpecialItemsTab from "@/components/store/SpecialItemsTab";
import PurchaseVP from "@/components/store/PurchaseVP";

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<
    "Power-Ups" | "Bundles" | "Special Items"
  >("Power-Ups");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHero />
      <StoreTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Power-Ups" && <PowerUpsTab />}
      {activeTab === "Bundles" && <BundlesTab />}
      {activeTab === "Special Items" && <SpecialItemsTab />}

      <PurchaseVP />
    </div>
  );
}
