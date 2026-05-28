import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  test: {
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/.trunk/**', 'node_modules/**', 'dist/**', 'coverage/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      exclude: [
        'src/main.tsx',
        'src/App.tsx',
        'src/api/supabase.ts',
        'src/layouts/MainLayout.tsx',
        'src/services/authService.ts',
        'src/services/gameService.ts',
        'src/services/profileService.ts',
        'src/types/index.ts',
        'src/utils/testUtils.tsx',
      ],
      reporter: ['text', 'html', 'lcov'],
      provider: 'v8',
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
