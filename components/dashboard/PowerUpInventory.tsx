import { Zap, Shield, Eye, Code, Gem, Flame, Clock } from "lucide-react";

interface PowerUp {
  id: number;
  name: string;
  quantity: number;
  icon: string;
}

interface PowerUpInventoryProps {
  powerUps: PowerUp[];
}

export default function PowerUpInventory({ powerUps }: PowerUpInventoryProps) {
  const getPowerUpIcon = (icon: string) => {
    switch (icon) {
      case "⚡":
        return <Zap className="text-yellow-400 h-6 w-6" />;
      case "⏳":
        return <Clock className="text-purple-400 h-6 w-6" />;
      case "🛡":
        return <Shield className="text-cyan h-6 w-6" />;
      case "👁":
        return <Eye className="text-green-400 h-6 w-6" />;
      case "💎":
        return <Gem className="text-blue-400 h-6 w-6" />;
      default:
        return <Code className="text-orange-400 h-6 w-6" />;
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl text-cyan">Power Ups</h2>
        <button className="px-4 py-2 bg-cyan/20 text-cyan rounded-lg text-sm hover:bg-cyan/30 transition-colors">
          Visit Store
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {powerUps.map((powerUp) => (
          <div
            key={powerUp.id}
            className="bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-600">
                {getPowerUpIcon(powerUp.icon)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{powerUp.name}</h3>
              </div>
              <div className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                {powerUp.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
