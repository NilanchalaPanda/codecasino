interface BattleTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BattleTabs({
  activeTab,
  setActiveTab,
}: BattleTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "participants", label: `Participants (24)` },
    { id: "rules", label: "Rules & Prizes" },
  ];

  return (
    <div className="flex border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-mono transition-colors ${
            activeTab === tab.id
              ? "border-b-2 border-cyan text-foreground"
              : "text-gray-400 hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
