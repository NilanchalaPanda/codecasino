import { StoreItem } from "@/types/store";

interface StoreItemCardProps {
  item: StoreItem;
}

export default function StoreItemCard({ item }: StoreItemCardProps) {
  const getRarityColor = () => {
    switch (item.rarity) {
      case "common":
        return "border-gray-500/50";
      case "rare":
        return "border-cyan/50";
      case "epic":
        return "border-purple-500/50";
      case "legendary":
        return "border-orange-accent/50";
      default:
        return "border-gray-500/50";
    }
  };

  return (
    <div className={`border-2 ${getRarityColor()} rounded-lg p-4 bg-gray-800`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-gray-700">{item.icon}</div>
        <span
          className={`px-2 py-1 text-xs rounded-full bg-orange-accent text-background`}
        >
          {item.rarity.toUpperCase()}
        </span>
      </div>
      <h3 className="font-display text-xl mb-2">{item.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{item.description}</p>
      <div className="mb-4">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Effect:</span>
          <span className="text-cyan">{item.effect}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Duration:</span>
          <span className="text-cyan">{item.duration}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-orange-accent font-bold">{item.vpCost} VP</span>
        <button className="px-4 py-2 rounded-lg text-sm font-mono bg-cyan text-background hover:bg-cyan/80">
          Purchase
        </button>
      </div>
    </div>
  );
}
