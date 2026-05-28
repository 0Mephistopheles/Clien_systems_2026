import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import GamesPage from '../pages/GamesPage';
import LeaderboardsPage from '../pages/LeaderboardsPage';
import AdminPage from '../pages/AdminPage';
import GameRoomPage from '../pages/GameRoomPage';

const mockAuth = vi.hoisted(() => ({
  session: { userId: 'user-anna', email: 'anna@example.com', role: 'admin' },
  profile: {
    id: 'user-anna',
    username: 'anna_spark',
    email: 'anna@example.com',
    avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=anna',
    role: 'admin',
    bio: 'Moderator',
    level: 12,
    wins: 48,
    losses: 17,
    elo: 1680,
    isBanned: false,
    achievements: ['first-win'],
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    session: mockAuth.session,
    profile: mockAuth.profile,
    loading: false,
    isAuthenticated: true,
    isAdmin: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
    refreshProfile: vi.fn(),
    updateProfile: vi.fn(),
    ensureRole: vi.fn().mockReturnValue(true),
  }),
}));

vi.mock('../services/gameService', () => ({
  listGames: vi.fn().mockResolvedValue([
    {
      id: 'game-ttt',
      slug: 'tic-tac-toe',
      title: 'Tic Tac Toe Arena',
      description: 'Realtime board battles',
      playersMin: 2,
      playersMax: 2,
      genre: 'Strategy',
      realtime: true,
      accent: 'cyan',
      rating: 4.9,
    },
  ]),
  listRooms: vi.fn().mockResolvedValue([
    {
      id: 'room-1',
      gameId: 'game-ttt',
      name: 'Smoke Room',
      hostId: 'user-anna',
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
  ]),
  listLeaderboard: vi.fn().mockResolvedValue([
    {
      id: 'lb-1',
      profileId: 'user-anna',
      username: 'anna_spark',
      avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=anna',
      gameId: 'game-ttt',
      points: 2140,
      wins: 48,
      matches: 65,
      rank: 1,
    },
  ]),
  createRoom: vi.fn().mockResolvedValue({ id: 'room-1' }),
  listProfiles: vi.fn().mockResolvedValue([]),
  updateUserRole: vi.fn().mockResolvedValue(null),
  banUser: vi.fn().mockResolvedValue(null),
}));

vi.mock('../hooks/useRealtimeRoom', () => ({
  useRealtimeRoom: () => ({
    room: {
      id: 'room-1',
      gameId: 'game-ttt',
      name: 'Smoke Room',
      hostId: 'user-anna',
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
    messages: [],
    board: ['X', 'O', '', '', 'X', '', '', '', 'O'],
    presence: {},
    loading: false,
    sendChatMessage: vi.fn(),
    makeMove: vi.fn(),
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('page smoke tests', () => {
  it('renders static info pages', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/designed for labs 1 to 6/i)).toBeInTheDocument();

    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/contact the team/i)).toBeInTheDocument();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/sign in to play/i)).toBeInTheDocument();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/create your player profile/i)).toBeInTheDocument();

    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/arena not found/i)).toBeInTheDocument();
  });

  it('renders the interactive pages', async () => {
    render(
      <MemoryRouter>
        <GamesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/choose a mini game/i)).toBeInTheDocument();

    render(
      <MemoryRouter>
        <LeaderboardsPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/leaderboards/i)).toBeInTheDocument();

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/user management/i)).toBeInTheDocument();
  });

  it('renders the room page route', () => {
    render(
      <MemoryRouter initialEntries={['/games/tic-tac-toe/rooms/room-1']}>
        <Routes>
          <Route path="/games/:gameSlug/rooms/:roomId" element={<GameRoomPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/room code/i)).toBeInTheDocument();
  });
});
