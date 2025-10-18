import { Zap, Shield, Eye, Code } from "lucide-react";

interface PowerUp {
  id: string;
  name: string;
  description: string;
  quantity: number;
  icon: React.ReactNode;
  color: string;
}

export default function ProfilePowerUps({ userId }: { userId: string }) {
  // Mock data - replace with actual data fetching
  const powerUps: PowerUp[] = [
    {
      id: "1",
      name: "Shadow Strike",
      description: "Instantly solve one problem",
      quantity: 3,
      icon: <Zap className="text-orange-400" />,
      color: "text-orange-400",
    },
    {
      id: "2",
      name: "Time Warp",
      description: "Extend battle time by 30 minutes",
      quantity: 1,
      icon: <Shield className="text-cyan" />,
      color: "text-cyan",
    },
    {
      id: "3",
      name: "Mystic Shield",
      description: "Protect from one wrong submission",
      quantity: 2,
      icon: <Eye className="text-green-400" />,
      color: "text-green-400",
    },
    {
      id: "4",
      name: "Code Vision",
      description: "Reveal optimal approach hints",
      quantity: 1,
      icon: <Code className="text-purple-400" />,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="font-display text-xl text-cyan mb-6">Power Ups</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {powerUps.map((powerUp) => (
          <div key={powerUp.id} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-600 ${powerUp.color}`}>
                {powerUp.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{powerUp.name}</h3>
                <p className="text-gray-400 text-xs mt-1">
                  {powerUp.description}
                </p>
              </div>
              <div className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                {powerUp.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="px-4 py-2 bg-cyan/20 text-cyan rounded-lg hover:bg-cyan/30 transition-colors">
          Visit Store
        </button>
      </div>
    </div>
  );
}
