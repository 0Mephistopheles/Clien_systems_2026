import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

const mockData = vi.hoisted(() => ({
  games: [
    {
      id: 'game-ttt',
      slug: 'tic-tac-toe',
      title: 'Tic Tac Toe Arena',
      description: 'Real-time board battles with instant move sync and rematch flow.',
      playersMin: 2,
      playersMax: 2,
      genre: 'Strategy',
      realtime: true,
      accent: 'cyan',
      rating: 4.9,
    },
  ],
  leaderboard: [
    {
      id: 'lb-1',
      profileId: 'user-1',
      username: 'alpha',
      avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=alpha',
      gameId: 'game-ttt',
      points: 1000,
      wins: 10,
      matches: 12,
      rank: 1,
    },
  ],
  rooms: [
    {
      id: 'room-1',
      gameId: 'game-ttt',
      name: 'North America Clash',
      hostId: 'user-1',
      status: 'playing',
      maxPlayers: 2,
      currentPlayers: 2,
      code: 'AX92QZ',
      isPrivate: false,
      board: ['X', 'O', '', '', 'X', '', '', '', 'O'],
      currentTurn: 'X',
      winner: null,
      lastActivity: new Date().toISOString(),
    },
  ],
}));

vi.mock('../services/gameService', () => ({
  listGames: vi.fn().mockResolvedValue(mockData.games),
  listLeaderboard: vi.fn().mockResolvedValue(mockData.leaderboard),
  listRooms: vi.fn().mockResolvedValue(mockData.rooms),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows hero content and featured cards', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/realtime multiplayer arena/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/featured room/i)).toBeInTheDocument());
    expect(screen.getAllByText(/play browser mini games/i).length).toBeGreaterThan(0);
  });
});
