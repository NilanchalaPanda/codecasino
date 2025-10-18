interface StoreBundleCardProps {
  bundle: {
    id: number;
    name: string;
    description: string;
    vpCost: number;
    originalCost: number;
    discount: string;
    icon: React.ReactNode;
  };
}

export default function StoreBundleCard({ bundle }: StoreBundleCardProps) {
  return (
    <div className="border-2 border-orange-accent rounded-lg p-4 bg-gray-800">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-gray-700">{bundle.icon}</div>
        <span className="px-2 py-1 text-xs rounded-full bg-orange-accent text-background">
          {bundle.discount}
        </span>
      </div>
      <h3 className="font-display text-xl mb-2">{bundle.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{bundle.description}</p>
      <div className="mb-4">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>{bundle.vpCost} VP</span>
          <span className="line-through text-gray-500">
            {bundle.originalCost} VP
          </span>
        </div>
      </div>
      <button className="w-full py-2 rounded-lg font-mono bg-orange-accent text-background hover:bg-orange-accent/80">
        Purchase Bundle
      </button>
    </div>
  );
}
