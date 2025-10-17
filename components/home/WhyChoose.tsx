import { Swords, Trophy, Crown, Code2 } from "lucide-react";

export default function WhyChoose() {
  const features = [
    {
      icon: <Swords className="h-6 w-6 text-cyan" />,
      title: "Real-time Battles",
      desc: "Compete against developers worldwide in live coding challenges with instant feedback and rankings.",
    },
    {
      icon: <Trophy className="h-6 w-6 text-cyan" />,
      title: "Skill-based Ranking",
      desc: "Climb through Bronze, Silver, Gold, Platinum, and Diamond tiers based on your performance.",
    },
    {
      icon: <Crown className="h-6 w-6 text-cyan" />,
      title: "Victory Points",
      desc: "Earn VP through victories and use them to unlock power-ups, themes, and exclusive content.",
    },
    {
      icon: <Code2 className="h-6 w-6 text-cyan" />,
      title: "Algorithm Mastery",
      desc: "Master data structures, algorithms, and problem-solving techniques through gamified challenges.",
    },
  ];
  return (
    <section className="py-16 sm:py-20 bg-background text-foreground text-center px-4">
      <h2 className="font-display text-3xl sm:text-4xl mb-4 text-foreground">
        Why Choose <span className="text-cyan">CodeCasino</span>?
      </h2>
      <p className="text-secondary max-w-2xl mx-auto mb-8 sm:mb-12 font-mono text-sm sm:text-base">
        Experience coding like never before with our gamified platform designed
        for competitive programmers.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {features.map((item) => (
          <div
            key={item.title}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 hover:border-cyan transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="bg-gray-800 rounded-md p-2 sm:p-3 mb-2 sm:mb-4">
              {item.icon}
            </div>
            <h3 className="font-semibold font-display text-lg sm:text-xl mb-1 sm:mb-2 text-foreground">
              {item.title}
            </h3>
            <p className="text-foreground/80 text-xs sm:text-sm font-mono">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
