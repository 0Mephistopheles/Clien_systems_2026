import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import type { Profile } from '../types';

const profile: Profile = {
  id: 'user-1',
  username: 'test_player',
  email: 'test@example.com',
  avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=test',
  role: 'user',
  bio: 'Test bio',
  level: 3,
  wins: 5,
  losses: 2,
  elo: 1280,
  isBanned: false,
  achievements: ['first-win'],
};

const updateProfile = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    profile,
    updateProfile,
  }),
}));

vi.mock('../services/gameService', () => ({
  listFriends: vi.fn().mockResolvedValue([]),
  listMatches: vi.fn().mockResolvedValue([]),
  listNotifications: vi.fn().mockResolvedValue([]),
  markNotificationRead: vi.fn().mockResolvedValue(null),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile details and editor', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('test_player')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Save profile' })).toBeInTheDocument();
  });
});
