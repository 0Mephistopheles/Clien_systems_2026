import { Link } from 'react-router-dom';
import type { Game } from '../../types';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';

type GameCardProps = {
  game: Game;
  onCreateRoom?: (game: Game) => void;
};

export default function GameCard({ game, onCreateRoom }: GameCardProps) {
  return (
    <Card className={`game-card game-card--${game.accent}`}>
      <div className="game-card__header">
        <Badge tone="accent">{game.genre}</Badge>
        {game.realtime ? <Badge tone="success">Realtime</Badge> : <Badge tone="neutral">Async</Badge>}
      </div>
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      <ul className="game-card__stats">
        <li>{game.playersMin}-{game.playersMax} players</li>
        <li>{game.rating.toFixed(1)} rating</li>
      </ul>
      <div className="game-card__actions">
        <Link className="btn btn--secondary btn--sm" to={`/games/${game.slug}`}>
          View game
        </Link>
        <Button size="sm" onClick={() => onCreateRoom?.(game)}>
          Create room
        </Button>
      </div>
    </Card>
  );
}
