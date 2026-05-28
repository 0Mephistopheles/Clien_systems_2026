import { type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export function renderWithProviders(ui: ReactNode, initialEntries = ['/']) {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  );
}
