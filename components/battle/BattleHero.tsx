import { Crown, Flame, Swords, Trophy } from "lucide-react";

export default function BattleHero() {
  const battleDetails = [
    {
      desc: "Your Battles",
      icon: <Swords className="text-cyan" />,
      number: 47,
    },
    { desc: "Win Rate", icon: <Trophy className="text-cyan" />, number: "68%" },
    {
      desc: "Current Streak",
      icon: <Flame className="text-cyan" />,
      number: 5,
    },
    {
      desc: "VP Balance",
      icon: <Crown className="text-cyan" />,
      number: "2,450",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto bg-background px-4 sm:px-6 lg:px-8 pt-12 pb-8">
      <h1 className="font-display text-4xl mb-2 font-semibold text-center text-cyan">
        Battle Arena
      </h1>
      <p className="text-lg max-w-3xl mx-auto text-center text-gray-400">
        Choose your battle format and prove your coding skills against
        developers worldwide
      </p>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {battleDetails.map((item) => (
          <div
            key={item.desc}
            className="bg-gray-800 border border-cyan/20 rounded-lg p-4 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="bg-gray-700 rounded-md p-2 mb-2 text-cyan">
              {item.icon}
            </div>
            <h3 className="font-display text-xl text-foreground">
              {item.number}
            </h3>
            <p className="text-gray-400 text-sm font-mono">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
