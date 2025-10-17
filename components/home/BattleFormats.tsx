import { Code2, Timer, SkipForward, Zap } from "lucide-react";

export default function BattleFormats() {
  const features = [
    {
      icon: <Timer className="h-6 w-6 text-cyan" />,
      title: "Marathon",
      desc: "Compete against developers worldwide in live coding challenges with instant feedback and rankings.",
      duration: "60 mins",
      problems: "4-6",
      difficulty: "Mixed",
    },
    {
      icon: <Zap className="h-6 w-6 text-cyan" />,
      title: "Sprinter",
      desc: "Climb through Bronze, Silver, Gold, Platinum, and Diamond tiers based on your performance.",
      duration: "15 mins",
      problems: "2-3",
      difficulty: "Easy-Medium",
    },
    {
      icon: <SkipForward className="h-6 w-6 text-cyan" />,
      title: "Pacer",
      desc: "Earn VP through victories and use them to unlock power-ups, themes, and exclusive content.",
      duration: "30 mins",
      problems: "3-4",
      difficulty: "Medium",
    },
    {
      icon: <Code2 className="h-6 w-6 text-cyan" />,
      title: "Jogger",
      desc: "Master data structures, algorithms, and problem-solving techniques through gamified challenges.",
      duration: "45 mins",
      problems: "3-5",
      difficulty: "Medium-Hard",
    },
  ];

  const StatRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center text-xs sm:text-sm mb-1 font-mono">
      <span className="text-secondary">{label}:</span>
      <span className="text-cyan font-bold">{value}</span>
    </div>
  );

  return (
    <section className="py-16 sm:py-20 bg-background text-foreground text-center px-4">
      <h2 className="font-display text-3xl sm:text-4xl mb-4 text-foreground">
        Battle Formats
      </h2>
      <p className="text-secondary max-w-2xl mx-auto mb-8 sm:mb-12 font-mono text-sm sm:text-base">
        Choose your preferred battle format and compete at your skill level.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {features.map((item) => (
          <div
            key={item.title}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 hover:border-cyan transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="bg-gray-800 rounded-md p-2 sm:p-3 mb-1 sm:mb-2">
              {item.icon}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              {item.title}
            </h3>
            <div className="mt-4 sm:mt-6 w-full space-y-2 sm:space-y-4">
              <StatRow label="Duration" value={item.duration} />
              <StatRow label="Problems" value={item.problems} />
              <StatRow label="Difficulty" value={item.difficulty} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
