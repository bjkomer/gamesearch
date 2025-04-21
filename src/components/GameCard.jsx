import './GameCard.css';
function GameCard({ game }) {
    return (
      <div className="game-card">
        <img src={game.image} alt={game.name} />
        <h2 className="game-card__title">{game.name}</h2>
        <p className="game-card__description">{game.description}</p>
        <ul className="game-card__details">
          <li><strong>Players:</strong> {game.min_players} - {game.max_players}</li>
          <li><strong>Play Time:</strong> {game.play_time} minutes</li>
        </ul>
      </div>
    );
  }
  
  export default GameCard;