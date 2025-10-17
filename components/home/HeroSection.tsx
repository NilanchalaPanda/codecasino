import { Sword, BarChart3, Target, Crown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center bg-background px-4">
      <h1 className="font-display font-semibold text-6xl sm:text-7xl mb-4 text-cyan">
        Code<span className="text-foreground">Casino</span>
      </h1>
      <p className="text-secondary text-lg max-w-2xl mb-8">
        Enter the ultimate coding arena where algorithms meet adrenaline. Battle
        fellow developers, climb the leaderboard, and prove your programming
        prowess.
      </p>

      <div className="flex flex-wrap gap-4 justify-center mb-16">
        <button className="px-8 py-3 bg-cyan text-black font-bold rounded-md hover:bg-orange-accent transition flex items-center gap-2">
          <Sword size={18} /> Start Battle
        </button>
        <button className="px-8 py-3 border border-cyan text-cyan font-bold rounded-md hover:bg-cyan hover:text-black transition flex items-center gap-2">
          <BarChart3 size={18} /> View Dashboard
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
        <StatCard icon={<UserIcon />} value="12,847" label="Active Warriors" />
        <StatCard
          icon={<Sword size={20} />}
          value="89,234"
          label="Battles Fought"
        />
        <StatCard
          icon={<Target size={20} />}
          value="156,789"
          label="Problems Solved"
        />
        <StatCard
          icon={<Crown size={20} />}
          value="2.4M"
          label="VP Distributed"
        />
      </div>
    </section>
  );
};

export default HeroSection;

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-md border border-gray-700 flex flex-col items-center">
      <div className="text-cyan mb-2">{icon}</div>
      <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      <p className="text-sm text-secondary">{label}</p>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-cyan"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
