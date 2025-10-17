import {
  Swords,
  BarChart3,
  Target,
  Crown,
  CodeXml,
  UserRound,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center bg-background px-4">
      <h1 className="font-display font-semibold text-6xl sm:text-4xl mb-4 text-cyan">
        Code<span className="text-foreground">Casino</span>
      </h1>
      <p className="text-secondary text-lg max-w-2xl mb-8">
        Enter the ultimate coding arena where algorithms meet adrenaline. Battle
        fellow developers, climb the leaderboard, and prove your programming
        prowess.
      </p>

      <div className="flex flex-wrap gap-4 justify-center mb-16">
        <button className="px-8 py-3 bg-cyan text-black font-bold rounded-md hover:bg-orange-accent transition flex items-center gap-2">
          <Swords size={18} /> Start Battle
        </button>
        <button className="px-8 py-3 border border-cyan text-cyan font-bold rounded-md hover:bg-cyan hover:text-black transition flex items-center gap-2">
          <BarChart3 size={18} /> View Dashboard
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
        <StatCard
          icon={<UserRound size={22} />}
          value="12,847"
          label="Active Warriors"
        />
        <StatCard
          icon={<Swords size={22} />}
          value="89,234"
          label="Battles Fought"
        />
        <StatCard
          icon={<CodeXml size={22} />}
          value="156,789"
          label="Problems Solved"
        />
        <StatCard
          icon={<Crown size={22} />}
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
      <h3 className="font-display text-2xl font-bold text-foreground">
        {value}
      </h3>
      <p className="text-sm text-secondary">{label}</p>
    </div>
  );
}
