export default function BattleSearchBar() {
  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search battles..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {["All", "Marathon", "Sprinter", "Pacer", "Jogger"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 bg-gray-800 text-gray-400 hover:text-foreground rounded-lg text-sm font-mono transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
