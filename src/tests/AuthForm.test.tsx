import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthForm from '../components/games/AuthForm';

const navigate = vi.fn();
const login = vi.fn().mockResolvedValue(undefined);
const register = vi.fn().mockResolvedValue({ requiresVerification: true });
const resetPassword = vi.fn().mockResolvedValue(undefined);

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login,
    register,
    resetPassword,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('AuthForm', () => {
  beforeEach(() => {
    navigate.mockReset();
    login.mockClear();
    register.mockClear();
    resetPassword.mockClear();
  });

  it('submits login credentials', async () => {
    render(
      <MemoryRouter>
        <AuthForm mode="login" />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'player@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Strong123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('player@example.com', 'Strong123');
      expect(navigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('submits registration and returns to login when verification is required', async () => {
    render(
      <MemoryRouter>
        <AuthForm mode="register" />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'arena_runner' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'player@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Strong123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        email: 'player@example.com',
        password: 'Strong123',
        username: 'arena_runner',
      });
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });
});
