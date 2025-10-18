interface StoreTabsProps {
  activeTab: "Power-Ups" | "Bundles" | "Special Items";
  setActiveTab: (tab: "Power-Ups" | "Bundles" | "Special Items") => void;
}

export default function StoreTabs({ activeTab, setActiveTab }: StoreTabsProps) {
  const tabs = ["Power-Ups", "Bundles", "Special Items"] as const;

  return (
    <div className="flex justify-center gap-8 my-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-lg font-mono transition-colors ${
            activeTab === tab
              ? "text-cyan border-b-2 border-cyan"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
