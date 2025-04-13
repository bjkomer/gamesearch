import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import gamesData from "./data/boardgames.json";
import GameCard from './components/GameCard';

function App() {
  const [search, setSearch] = useState("");
  const [filteredGames, setFilteredGames] = useState(gamesData);

  useEffect(() => {
    setFilteredGames(
      gamesData.filter((game) =>
        game.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
    {filteredGames.map((game, index) => (
      <GameCard key={index} game={game} />
    ))}
  </div>
  );
}


//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Board Game Search</h1>
//       <input
//         type="text"
//         placeholder="Search games..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="border p-2 w-full mb-4"
//       />
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
//         {filteredGames.map((game, index) => (
//           <GameCard key={index} game={game} />
//         ))}
//       </div>
//       {/* <ul>
//         {filteredGames.map((game, index) => (
//           <li key={index} className="mb-2 border-b pb-2">
//             <GameCard game={game} />
//           </li>
//         ))}
//       </ul> */}
//     </div>
//   );
// }

export default App
