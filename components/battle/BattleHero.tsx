import { Crown, Flame, Swords, Trophy } from "lucide-react";

export default function BattleHero() {
  const battleDetails = [
    {
      desc: "Your Battles",
      icon: <Swords />,
      number: 47,
    },
    {
      desc: "Win Rate",
      icon: <Trophy />,
      number: "68%",
    },
    {
      desc: "Current Streak",
      icon: <Flame />,
      number: 5,
    },
    {
      desc: "VP Balance",
      icon: <Crown />,
      number: "2,450",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto bg-cover bg-center flex flex-col justify-center items-center px-10 pt-12">
      <h1 className="font-display text-4xl mb-2 font-semibold">Battle Arena</h1>
      <p className="text-lg max-w-3xl text-center text-gray-400">
        Choose your battle format and prove your coding skills against
        developers worldwide
      </p>

      <div className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mx-auto">
        {battleDetails.map((item) => (
          <div
            key={item.desc}
            className="bg-gray-900 border border-cyan/20 rounded-lg p-4 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="bg-gray-800 rounded-md text-cyan">{item.icon}</div>
            <h3 className="font-semibold font-display text-lg sm:text-xl text-foreground">
              {item.number}
            </h3>
            <p className="text-foreground/80 text-xs sm:text-sm font-mono">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
