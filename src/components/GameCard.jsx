import './GameCard.css';
function GameCard({ game }) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 max-w-sm">
        <img src={game.thumbnail} alt={game.name} className="rounded-xl mb-4" />
        <h2 className="text-xl font-bold mb-2">{game.name}</h2>
        <p className="text-sm text-gray-600 mb-2">{game.description}</p>
        <ul className="text-sm text-gray-800">
          <li><strong>Players:</strong> {game.min_players} - {game.max_players}</li>
          <li><strong>Play Time:</strong> {game.play_time} minutes</li>
          {/* <li><strong>Complexity:</strong> {game.complexity}</li> */}
        </ul>
      </div>
    );
  }
  
  export default GameCard;