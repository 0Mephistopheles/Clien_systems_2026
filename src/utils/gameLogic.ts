export type TicTacToePlayer = 'X' | 'O';

export const emptyBoard = () => Array(9).fill('');

const winLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getTicTacToeWinner(board: string[]) {
  for (const [a, b, c] of winLines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a] as TicTacToePlayer;
    }
  }

  return board.every(Boolean) ? 'draw' : null;
}

export function getNextPlayer(board: string[]) {
  const xCount = board.filter((item) => item === 'X').length;
  const oCount = board.filter((item) => item === 'O').length;
  return xCount <= oCount ? 'X' : 'O';
}

export function getRandomChoice<T>(options: T[]) {
  return options[Math.floor(Math.random() * options.length)];
}

export function scoreReaction(milliseconds: number) {
  if (milliseconds < 250) return 100;
  if (milliseconds < 500) return 80;
  if (milliseconds < 750) return 60;
  return 40;
}
