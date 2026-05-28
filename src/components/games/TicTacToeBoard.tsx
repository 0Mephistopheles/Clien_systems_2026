import { cn } from '../../utils/cn';

type TicTacToeBoardProps = {
  board: string[];
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | 'draw' | null;
  onMove: (index: number, player: 'X' | 'O') => void;
};

export default function TicTacToeBoard({ board, currentPlayer, winner, onMove }: TicTacToeBoardProps) {
  return (
    <section className="tic-tac-toe">
      <div className="tic-tac-toe__status">
        {winner ? (
          <strong>{winner === 'draw' ? 'Draw match' : `Player ${winner} wins`}</strong>
        ) : (
          <strong>Turn: Player {currentPlayer}</strong>
        )}
      </div>
      <div className="tic-tac-toe__grid" role="grid" aria-label="Tic Tac Toe board">
        {board.map((cell, index) => (
          <button
            key={`${index}-${cell}`}
            type="button"
            className={cn('tic-tac-toe__cell', cell && `tic-tac-toe__cell--${cell.toLowerCase()}`)}
            onClick={() => onMove(index, currentPlayer)}
            disabled={Boolean(cell) || Boolean(winner)}
            aria-label={`Cell ${index + 1}`}
          >
            {cell}
          </button>
        ))}
      </div>
    </section>
  );
}
