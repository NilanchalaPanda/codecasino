interface Player {
  id: number;
  username: string;
  rank: number;
  volume: number;
  avatar: string;
  won: number;
  trades: number;
  winRate: number;
}

interface LeaderboardTopPlayersProps {
  players: Player[];
}

export default function LeaderboardTopPlayers({
  players,
}: LeaderboardTopPlayersProps) {
  return (
    <div className="flex justify-center min-h-96 items-end font-mono relative overflow-hidden">
      {players.map((player) => (
        <div
          key={player.rank}
          className={`relative flex flex-col items-center justify-end text-center rounded-lg
          ${player.rank === 1 ? "h-64" : player.rank === 2 ? "h-60" : "h-52"}
          w-56 bg-gradient-to-b from-gray-900 to-black border border-gray-700 shadow-[0_0_25px_rgba(0,255,255,0.2)] transform`}
          style={{
            transform: `translateY(${
              player.rank === 1 ? "0" : player.rank === 2 ? "20px" : "40px"
            })`,
          }}
        >
          {/* Avatar */}
          <div className="absolute -top-20">
            <div className="w-24 h-24 rounded-md overflow-hidden border-2 border-gray-600 shadow-lg bg-gray-800">
              <img
                src={player.avatar}
                alt={player.username}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>

          {/* Username */}
          <div className="absolute top-8">
            <span
              className={`text-sm ${
                player.rank === 1 ? "text-green-400" : "text-gray-300"
              }`}
            >
              [{player.rank}] {player.username}
            </span>
            <p className="text-blue-400 font-semibold text-lg">
              {player.volume.toLocaleString()}
            </p>
          </div>

          {/* Imaginary glowing edges */}
          <div className="absolute inset-0 rounded-lg border border-green-500/20 pointer-events-none"></div>

          {/* Podium base glow */}
          {/* <div className="absolute bottom-0 w-full h-2 bg-green-400/20 blur-sm rounded-b-lg"></div> */}
        </div>
      ))}
    </div>
  );
}

// export default function LeaderboardTopPlayers({
//   players,
// }: LeaderboardTopPlayersProps) {
//   // Podium settings for 1st, 2nd, 3rd
//   const heights = [100, 150, 100]; // Visual hierarchy
//   const zIndexes = [10, 30, 10]; // 1st place has the highest z-index
//   const colors = [
//     "from-gray-400 to-gray-700", // 2nd
//     "from-yellow-400 to-yellow-700", // 1st
//     "from-orange-400 to-orange-700", // 3rd
//   ];

//   return (
//     <div className="flex justify-center items-end gap-4 sm:gap-8 py-10">
//       {players.slice(0, 3).map((player, i) => (
//         <div
//           key={player.rank}
//           className="flex flex-col items-center"
//           style={{ zIndex: zIndexes[i] }}
//         >
//           {/* Player Avatar */}
//           <div
//             className="relative z-40 -mb-4 w-20 h-20 rounded-xl overflow-hidden border-4"
//             style={{
//               borderColor:
//                 i === 0 ? "#d4af37" : i === 1 ? "#a7a7ad" : "#cd7f32",
//             }}
//           >
//             <img
//               src={player.avatar}
//               alt={player.username}
//               className="object-cover w-full h-full"
//             />
//           </div>

//           {/* Podium Cube */}
//           <div
//             className="podium-cube relative"
//             style={{ height: `${heights[i]}px` }}
//           >
//             {/* Front Face */}
//             <div
//               className={`podium-front absolute bg-gradient-to-b ${colors[i]}`}
//             />
//               {/* <span className="font-bold text-lg">{player.username}</span>
//               <span className="text-sm opacity-80">
//                 {player.volume.toLocaleString()}
//               </span>
//             </div> */}

//             {/* Top Face */}
//             <div className="podium-top absolute"></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
