# Multiplayer Mini Games Platform

A production-style React SPA for a university Web Development course.

The project is designed around a multiplayer mini-games hub with Supabase handling authentication,
database storage, realtime updates, and email verification.

## Live Demo

- Public URL: `https://your-deployed-url.example`
- GitHub repository: `https://github.com/your-user/multiplayer-mini-games-platform`

Replace the placeholders above after you deploy the app to Vercel, Netlify, or GitHub Pages.

## Lab Coverage

### Lab 1

- Static, responsive HTML layouts in [`static-labs/lab1`](./static-labs/lab1)
- Semantic HTML5 structure
- Mobile-first SCSS/CSS layout
- Dark gaming theme, hover states, skeleton placeholders, and responsive sections

### Lab 2

- AJAX-style data access through a service layer
- Fetch-like async calls for games, rooms, profiles, leaderboard, and stats
- ESLint configured
- Environment variables for Supabase keys

### Lab 3

- React SPA with React Router
- Protected routes and admin routes
- Authentication state management
- Registration, login, logout, password reset, email verification flow
- Persistent sessions and user roles

### Lab 4

- Multiplayer mini games hub
- Game rooms and matchmaking
- Chat, notifications, friends, stats, match history, and leaderboards
- Realtime room sync through Supabase Realtime

### Lab 5

- Vitest + Testing Library
- Component, hook, route guard, utility, and page-level tests
- Coverage target configured at 70%

### Lab 6

- Realtime websocket-backed room sync
- Live chat
- Online presence
- Instant game board updates
- Room synchronization

## Features

- Supabase Auth with email verification
- Multiplayer room lobby
- Tic Tac Toe realtime gameplay
- Leaderboards
- Friend system
- Notifications
- Profile editing
- Admin moderation tools
- Responsive UI with dark gaming styling
- SCSS architecture with variables, mixins, nesting, partials, and responsive breakpoints

## Tech Stack

- React 18
- React Router
- Vite
- TypeScript
- SCSS/Sass
- Supabase Auth, Postgres, and Realtime
- Vitest
- Testing Library
- ESLint
- Prettier

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file from `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SITE_URL=https://your-deployed-url.example
VITE_BASE_PATH=/
```

### 3. Run locally

```bash
npm run dev
```

### 4. Lint

```bash
npm run lint
```

### 5. Test

```bash
npm run test
```

### 6. Coverage

```bash
npm run coverage
```

### 7. Build

```bash
npm run build
```

## Supabase Setup

1. Create a new Supabase project.
2. Enable email confirmations in Auth settings.
3. Run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL editor.
4. Create the `profiles` trigger for new users.
5. Enable Realtime for `game_rooms`, `messages`, and `notifications` if you want live updates.
6. Add the `.env` values to your frontend hosting environment.

## Deployment

### Vercel

1. Import the repository.
2. Set the environment variables.
3. Use `npm run build` as the build command.
4. Deploy.

### GitHub Pages

1. Set `VITE_BASE_PATH` to your repository subpath.
2. Build the app with Vite.
3. Publish the `dist` folder.

## Project Structure

- `src/components` reusable UI and game components
- `src/pages` SPA routes
- `src/layouts` app shell and structural layout
- `src/hooks` custom realtime logic
- `src/services` Supabase and mock data adapters
- `src/api` client bootstrap
- `src/context` auth and theme state
- `src/routes` protected route guards
- `src/styles` SCSS partials and theme system
- `src/utils` helpers and validation
- `src/tests` automated tests
- `static-labs/lab1` pure HTML/CSS prototype for Lab 1

## Notes

- When Supabase environment variables are not set, the app falls back to a local demo store so the
  UI remains demonstrable.
- The deployment URLs above are placeholders and should be replaced once the project is actually
  hosted.
