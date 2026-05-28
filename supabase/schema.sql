create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text not null unique,
  avatar_url text not null default '',
  role text not null default 'user' check (role in ('guest', 'user', 'admin')),
  bio text not null default '',
  level integer not null default 1,
  wins integer not null default 0,
  losses integer not null default 0,
  elo integer not null default 1200,
  is_banned boolean not null default false,
  achievements text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  players_min integer not null,
  players_max integer not null,
  genre text not null,
  realtime boolean not null default true,
  accent text not null default 'cyan',
  rating numeric(3, 1) not null default 4.5,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  host_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  status text not null default 'open' check (status in ('open', 'full', 'playing', 'closed')),
  max_players integer not null,
  current_players integer not null default 1,
  code text not null unique,
  is_private boolean not null default false,
  board text[] not null default '{}',
  current_turn text not null default 'X' check (current_turn in ('X', 'O')),
  winner text check (winner in ('X', 'O', 'draw')),
  last_activity timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  room_id uuid not null references public.game_rooms(id) on delete cascade,
  winner_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'active', 'finished')),
  score integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz
);

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  username text not null,
  avatar_url text not null,
  game_id uuid not null references public.games(id) on delete cascade,
  points integer not null default 0,
  wins integer not null default 0,
  matches integer not null default 0,
  rank integer not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.friends (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.game_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_name text not null,
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  icon text not null,
  points integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, achievement_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'avatarUrl', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'user')
  )
  on conflict (id) do update
    set username = excluded.username,
        email = excluded.email,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.game_rooms enable row level security;
alter table public.matches enable row level security;
alter table public.leaderboard enable row level security;
alter table public.friends enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

create policy "Public games are readable"
on public.games
for select
using (true);

create policy "Profiles are readable by authenticated users"
on public.profiles
for select
using (auth.role() = 'authenticated' or auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Rooms are readable by participants"
on public.game_rooms
for select
using (
  auth.role() = 'authenticated'
  and (
    host_id = auth.uid()
    or not is_private
  )
);

create policy "Room hosts can manage rooms"
on public.game_rooms
for all
using (host_id = auth.uid())
with check (host_id = auth.uid());

create policy "Messages are readable by room participants"
on public.messages
for select
using (auth.role() = 'authenticated');

create policy "Authenticated users can write messages"
on public.messages
for insert
with check (auth.role() = 'authenticated' and sender_id = auth.uid());

create policy "Leaderboards are readable"
on public.leaderboard
for select
using (true);

create policy "Notifications belong to users"
on public.notifications
for select
using (user_id = auth.uid());

create policy "Users can update their notifications"
on public.notifications
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Friend data is protected"
on public.friends
for select
using (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "Authenticated users can create friend requests"
on public.friends
for insert
with check (requester_id = auth.uid());

create policy "Achievements are readable"
on public.achievements
for select
using (true);

create policy "User achievements are readable by owner"
on public.user_achievements
for select
using (user_id = auth.uid());

create policy "Matches are readable by players"
on public.matches
for select
using (auth.role() = 'authenticated');
