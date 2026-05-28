export type Role = 'guest' | 'user' | 'admin';

export type GameSlug =
  | 'tic-tac-toe'
  | 'rock-paper-scissors'
  | 'memory-duel'
  | 'speed-reaction'
  | 'quiz-battle'
  | 'number-guess';

export type Game = {
  id: string;
  slug: GameSlug;
  title: string;
  description: string;
  playersMin: number;
  playersMax: number;
  genre: string;
  realtime: boolean;
  accent: string;
  rating: number;
};

export type Profile = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: Role;
  bio: string;
  level: number;
  wins: number;
  losses: number;
  elo: number;
  isBanned: boolean;
  achievements: string[];
};

export type Match = {
  id: string;
  gameId: string;
  roomId: string;
  winnerId: string | null;
  status: 'pending' | 'active' | 'finished';
  startedAt: string;
  endedAt: string | null;
  score: number;
};

export type Room = {
  id: string;
  gameId: string;
  name: string;
  hostId: string;
  status: 'open' | 'full' | 'playing' | 'closed';
  maxPlayers: number;
  currentPlayers: number;
  code: string;
  isPrivate: boolean;
  board: string[];
  currentTurn: 'X' | 'O';
  winner: 'X' | 'O' | 'draw' | null;
  lastActivity: string;
};

export type Message = {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
};

export type LeaderboardEntry = {
  id: string;
  profileId: string;
  username: string;
  avatarUrl: string;
  gameId: string;
  points: number;
  wins: number;
  matches: number;
  rank: number;
};

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export type Friend = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
};

export type Achievement = {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  points: number;
};

export type AppSession = {
  userId: string;
  email: string;
  role: Role;
};
