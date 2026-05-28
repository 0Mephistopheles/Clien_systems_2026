import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';

const mockUseAuth = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('redirects unauthenticated users to login', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Secret content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('renders children for authenticated users', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Secret content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });
});
