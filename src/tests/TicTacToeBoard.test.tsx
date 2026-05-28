import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import TicTacToeBoard from '../components/games/TicTacToeBoard';

describe('TicTacToeBoard', () => {
  it('calls onMove when a cell is selected', () => {
    const onMove = vi.fn();

    render(
      <TicTacToeBoard
        board={['', '', '', '', '', '', '', '', '']}
        currentPlayer="X"
        winner={null}
        onMove={onMove}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cell 1' }));
    expect(onMove).toHaveBeenCalledWith(0, 'X');
  });
});
