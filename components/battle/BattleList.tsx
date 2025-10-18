import BattleCard from "./BattleCard";

export default function BattleList() {
  const battles = [
    {
      id: "1",
      type: "Marathon",
      difficulty: "Medium",
      entryFee: "50 VP",
      prizePool: "200-500 VP",
      players: "4/8",
      time: "Starts in 10m",
      status: "Waiting",
    },
    {
      id: "2",
      type: "Sprinter",
      difficulty: "Easy",
      entryFee: "20 VP",
      prizePool: "60-150 VP",
      players: "3/6",
      time: "Starts in 5m",
      status: "Waiting",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {battles.map((battle) => (
        <BattleCard key={battle.id} battle={battle} />
      ))}
    </div>
  );
}
