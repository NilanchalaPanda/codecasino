export type ItemRarity = "common" | "rare" | "epic" | "legendary";

export interface StoreItem {
  id: number;
  name: string;
  description: string;
  effect: string;
  duration: string;
  vpCost: number;
  rarity: ItemRarity;
  icon: React.ReactNode;
}
