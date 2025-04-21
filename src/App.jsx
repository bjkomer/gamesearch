import { useState, useEffect } from 'react'
import './App.css'
import gamesData from "./data/boardgames.json";
import GameCard from './components/GameCard';
import PlayerSlider from './components/PlayerSlider';

export default function App() {
  const [search, setSearch] = useState("");
  const [playerRange, setPlayerRange] = useState([1, 10]);
  const [filteredGames, setFilteredGames] = useState(gamesData);

  useEffect(() => {
    setFilteredGames(
      gamesData
        .filter((game) =>
          game.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((game) => {
          const [minPlay, maxPlay] = playerRange;
          return (
            (game.max_players >= minPlay) && (game.min_players <= maxPlay)
          );
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [search, playerRange]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Board Game Search</h1>
      <input
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <PlayerSlider
        value={playerRange}
        onValueChange={setPlayerRange}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredGames.map((game, index) => (
          <GameCard key={index} game={game} />
        ))}
      </div>
    </div>
  );
}
