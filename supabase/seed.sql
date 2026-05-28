insert into public.games (slug, title, description, players_min, players_max, genre, realtime, accent, rating)
values
  (
    'tic-tac-toe',
    'Tic Tac Toe Arena',
    'Real-time board battles with instant move sync and rematch flow.',
    2,
    2,
    'Strategy',
    true,
    'cyan',
    4.9
  ),
  (
    'rock-paper-scissors',
    'RPS Blitz',
    'Fast ladder-friendly duels with streak multipliers.',
    2,
    2,
    'Arcade',
    true,
    'violet',
    4.7
  ),
  (
    'memory-duel',
    'Memory Duel',
    'Flip cards, trap your opponent, and claim the board.',
    2,
    4,
    'Puzzle',
    false,
    'gold',
    4.8
  ),
  (
    'quiz-battle',
    'Quiz Battle',
    'Compete on trivia streaks, categories, and accuracy.',
    2,
    8,
    'Trivia',
    true,
    'emerald',
    4.6
  )
on conflict (slug) do nothing;

insert into public.achievements (code, title, description, icon, points)
values
  ('first-win', 'First Win', 'Win your first multiplayer match.', '🏆', 25),
  ('chat-master', 'Chat Master', 'Send 50 helpful messages in game rooms.', '💬', 30),
  ('streak-5', 'Hot Streak', 'Win five matches in a row.', '🔥', 50),
  ('admin-shield', 'Admin Shield', 'Resolve a moderation incident.', '🛡️', 40),
  ('elite', 'Elite', 'Reach the elite ladder tier.', '⚡', 60),
  ('marshal', 'Marshal', 'Moderate 20 rooms successfully.', '⭐', 45),
  ('fast-fingers', 'Fast Fingers', 'Win a speed game in under 5 seconds.', '⌛', 35),
  ('top-10', 'Top 10', 'Reach the top 10 on a leaderboard.', '📈', 55)
on conflict (code) do nothing;
