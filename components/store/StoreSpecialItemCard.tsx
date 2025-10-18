interface StoreSpecialItemCardProps {
  item: {
    id: number;
    name: string;
    description: string;
    vpCost: number;
    type: string;
    icon: React.ReactNode;
  };
}

export default function StoreSpecialItemCard({
  item,
}: StoreSpecialItemCardProps) {
  return (
    <div className="border-2 border-orange-accent rounded-lg p-4 bg-gray-800">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-gray-700">{item.icon}</div>
        <span className="px-2 py-1 text-xs rounded-full bg-orange-accent text-background">
          {item.type}
        </span>
      </div>
      <h3 className="font-display text-xl mb-2">{item.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{item.description}</p>
      <div className="mb-4">
        <div className="text-orange-accent font-bold text-lg">
          {item.vpCost} VP
        </div>
      </div>
      <button className="w-full py-2 rounded-lg font-mono bg-orange-accent text-background hover:bg-orange-accent/80">
        Purchase
      </button>
    </div>
  );
}
