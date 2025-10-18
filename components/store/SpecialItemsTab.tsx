import StoreSpecialItemCard from "./StoreSpecialItemCard";

import { Crown, Ticket, LayoutTemplate } from "lucide-react";

export default function SpecialItemsTab() {
  const specialItems = [
    {
      id: 1,
      name: "Premium Membership",
      description: "Unlimited battles, exclusive tournaments, priority support",
      vpCost: 999,
      type: "MONTHLY",
      icon: <Crown className="h-6 w-6 text-orange-accent" />,
    },
    {
      id: 2,
      name: "Tournament Entry Pass",
      description: "Access to exclusive high-stakes tournaments",
      vpCost: 300,
      type: "LIMITED",
      icon: <Ticket className="h-6 w-6 text-orange-accent" />,
    },
    {
      id: 3,
      name: "Custom Battle Arena",
      description: "Create private battles with custom rules",
      vpCost: 800,
      type: "EXCLUSIVE",
      icon: <LayoutTemplate className="h-6 w-6 text-orange-accent" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {specialItems.map((item) => (
          <StoreSpecialItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
