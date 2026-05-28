import { describe, expect, it } from 'vitest';
import { emptyBoard, getNextPlayer, getRandomChoice, getTicTacToeWinner, scoreReaction } from '../utils/gameLogic';

describe('game logic helpers', () => {
  it('creates an empty board', () => {
    expect(emptyBoard()).toHaveLength(9);
    expect(emptyBoard().every((cell) => cell === '')).toBe(true);
  });

  it('detects tic tac toe winners', () => {
    expect(getTicTacToeWinner(['X', 'X', 'X', '', '', '', '', '', ''])).toBe('X');
    expect(getTicTacToeWinner(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'])).toBe('draw');
    expect(getTicTacToeWinner(['X', '', '', '', '', '', '', '', ''])).toBe(null);
  });

  it('calculates the next player', () => {
    expect(getNextPlayer(['X', '', '', '', '', '', '', '', ''])).toBe('O');
    expect(getNextPlayer(['X', 'O', '', '', '', '', '', '', ''])).toBe('X');
  });

  it('scores reaction speed', () => {
    expect(scoreReaction(200)).toBe(100);
    expect(scoreReaction(600)).toBe(60);
  });

  it('returns a random choice from the list', () => {
    expect(['rock', 'paper', 'scissors']).toContain(getRandomChoice(['rock', 'paper', 'scissors']));
  });
});
