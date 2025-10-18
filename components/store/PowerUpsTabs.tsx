import StoreItemCard from "./StoreItemCard";

import {
  Zap,
  Shield,
  Eye,
  Code,
  Gem,
  Flame,
  Star,
  ShoppingBag,
} from "lucide-react";

export default function PowerUpsTab() {
  const powerUps = [
    {
      id: 1,
      name: "Shadow Strike",
      description: "Instantly solve one problem during battle",
      effect: "+1 Instant Solution",
      duration: "Single Use",
      vpCost: 150,
      rarity: "epic" as const,
      icon: <Zap className="h-6 w-6 text-orange-accent" />,
    },
    {
      id: 2,
      name: "Time Warp",
      description: "Extend battle time by 30 minutes",
      effect: "+30 Minutes",
      duration: "Single Use",
      vpCost: 200,
      rarity: "rare" as const,
      icon: <Shield className="h-6 w-6 text-cyan" />,
    },
    {
      id: 3,
      name: "Mystic Shield",
      description: "Protect from one wrong submission penalty",
      effect: "Penalty Protection",
      duration: "Single Use",
      vpCost: 100,
      rarity: "common" as const,
      icon: <Eye className="h-6 w-6 text-foreground" />,
    },
    {
      id: 4,
      name: "Code Vision",
      description: "Reveal optimal approach hints for problems",
      effect: "Problem Hints",
      duration: "3 Uses",
      vpCost: 300,
      rarity: "legendary" as const,
      icon: <Code className="h-6 w-6 text-orange-accent" />,
    },
    {
      id: 5,
      name: "Void Walker",
      description: "Exclusive dark theme with particle effects",
      effect: "Visual Theme",
      duration: "Permanent",
      vpCost: 500,
      rarity: "legendary" as const,
      icon: <Gem className="h-6 w-6 text-orange-accent" />,
    },
    {
      id: 6,
      name: "XP Multiplier",
      description: "Double experience points for next 5 battles",
      effect: "2x XP",
      duration: "5 Battles",
      vpCost: 250,
      rarity: "epic" as const,
      icon: <Flame className="h-6 w-6 text-orange-accent" />,
    },
    {
      id: 7,
      name: "Battle Rage",
      description: "Increase submission speed by 25%",
      effect: "+25% Speed",
      duration: "1 Battle",
      vpCost: 180,
      rarity: "rare" as const,
      icon: <Star className="h-6 w-6 text-cyan" />,
    },
    {
      id: 8,
      name: "Mystic Aura",
      description: "Glowing profile border and special effects",
      effect: "Profile Effects",
      duration: "30 Days",
      vpCost: 400,
      rarity: "epic" as const,
      icon: <ShoppingBag className="h-6 w-6 text-orange-accent" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mb-12">
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {["All Items", "Combat", "Utility", "Cosmetic", "Boost"].map(
          (category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-lg font-mono text-sm bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-foreground"
            >
              {category}
            </button>
          )
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {powerUps.map((item) => (
          <StoreItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
