import StoreBundleCard from "./StoreBundleCard";

import { ShoppingCart, Crown, Package } from "lucide-react";

export default function BundlesTab() {
  const bundles = [
    {
      id: 1,
      name: "Warrior Starter Pack",
      description: "Perfect for new warriors entering battles",
      vpCost: 500,
      originalCost: 750,
      discount: "33% OFF",
      icon: <ShoppingCart className="h-6 w-6 text-orange-accent" />,
    },
    {
      id: 2,
      name: "Master Combat Bundle",
      description: "Advanced power-ups for experienced fighters",
      vpCost: 1200,
      originalCost: 1800,
      discount: "33% OFF",
      icon: <Crown className="h-6 w-6 text-orange-accent" />,
    },
    {
      id: 3,
      name: "Legendary Collection",
      description: "All legendary items and exclusive content",
      vpCost: 2500,
      originalCost: 4000,
      discount: "38% OFF",
      icon: <Package className="h-6 w-6 text-orange-accent" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <StoreBundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}
