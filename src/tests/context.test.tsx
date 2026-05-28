import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

const authState = vi.hoisted(() => ({
  session: null as null | { userId: string; email: string; role: string },
  profile: null as null | { username: string },
}));

vi.mock('../services/authService', () => ({
  loadSession: vi.fn().mockImplementation(async () => authState.session),
  loginUser: vi.fn().mockImplementation(async ({ email }: { email: string }) => {
    authState.session = { userId: 'user-1', email, role: 'user' };
    return 'user-1';
  }),
  logoutUser: vi.fn().mockImplementation(async () => {
    authState.session = null;
    authState.profile = null;
  }),
  registerUser: vi.fn().mockImplementation(async ({ email, username }: { email: string; username: string }) => {
    authState.session = { userId: 'user-2', email, role: 'user' };
    authState.profile = { username };
    return { userId: 'user-2', requiresVerification: false };
  }),
  requestPasswordReset: vi.fn().mockResolvedValue(undefined),
  updateCurrentProfile: vi.fn().mockImplementation(async (patch: { username?: string }) => {
    authState.profile = { username: patch.username ?? authState.profile?.username ?? 'none' };
    return {
      id: 'user-1',
      username: authState.profile.username,
      email: authState.session?.email ?? 'anna@example.com',
      avatarUrl: '',
      role: 'user',
      bio: '',
      level: 1,
      wins: 0,
      losses: 0,
      elo: 1200,
      isBanned: false,
      achievements: [],
    };
  }),
}));

vi.mock('../services/profileService', () => ({
  getCurrentProfile: vi.fn().mockImplementation(async () =>
    authState.session
      ? {
          id: 'user-1',
          username: authState.profile?.username ?? 'anna_spark',
          email: authState.session.email,
          avatarUrl: '',
          role: 'user',
          bio: '',
          level: 1,
          wins: 0,
          losses: 0,
          elo: 1200,
          isBanned: false,
          achievements: [],
        }
      : null,
  ),
}));

function Harness() {
  const { theme, toggleTheme } = useTheme();
  const { session, profile, login, register, logout } = useAuth();
  const [status, setStatus] = useState('idle');

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="session">{session?.email ?? 'none'}</span>
      <span data-testid="profile">{profile?.username ?? 'none'}</span>
      <span data-testid="status">{status}</span>
      <button type="button" onClick={toggleTheme}>
        toggle
      </button>
      <button
        type="button"
        onClick={async () => {
          await login('anna@example.com', 'Strong123');
          setStatus('logged-in');
        }}
      >
        login
      </button>
      <button
        type="button"
        onClick={async () => {
          await register({
            email: 'new@example.com',
            password: 'Strong123',
            username: 'new_player',
          });
          setStatus('registered');
        }}
      >
        register
      </button>
      <button
        type="button"
        onClick={async () => {
          await logout();
          setStatus('logged-out');
        }}
      >
        logout
      </button>
    </div>
  );
}

describe('providers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    authState.session = null;
    authState.profile = null;
  });

  it('toggles theme and hydrates auth state', async () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <Harness />
        </AuthProvider>
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('dark'));

    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');

    fireEvent.click(screen.getByText('login'));
    await waitFor(() => expect(screen.getByTestId('session')).toHaveTextContent('anna@example.com'));

    fireEvent.click(screen.getByText('register'));
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('registered'));

    fireEvent.click(screen.getByText('logout'));
    await waitFor(() => expect(screen.getByTestId('session')).toHaveTextContent('none'));
  });
});
