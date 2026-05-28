import { hasSupabaseConfig, supabase } from '../api/supabase';
import type {
  AppSession,
  Friend,
  Game,
  GameSlug,
  LeaderboardEntry,
  Message,
  NotificationItem,
  Profile,
  Match,
  Room,
  Role,
} from '../types';
import { isValidEmail, isValidUsername } from '../utils/validation';
import {
  generateId,
  readMockState,
  setMockSession,
  updateMockState,
} from './mockStore';

export type RegisterPayload = {
  email: string;
  password: string;
  username: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UpdateProfilePayload = Partial<
  Pick<Profile, 'username' | 'avatarUrl' | 'bio' | 'role' | 'elo' | 'wins' | 'losses' | 'level' | 'isBanned'>
>;

export type RoomPayload = {
  gameId: string;
  name: string;
  maxPlayers: number;
  isPrivate?: boolean;
  hostId: string;
};

function mapProfileRow(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id ?? ''),
    username: String(row.username ?? ''),
    email: String(row.email ?? ''),
    avatarUrl: String(row.avatar_url ?? row.avatarUrl ?? ''),
    role: (row.role as Role) ?? 'user',
    bio: String(row.bio ?? ''),
    level: Number(row.level ?? 1),
    wins: Number(row.wins ?? 0),
    losses: Number(row.losses ?? 0),
    elo: Number(row.elo ?? 1200),
    isBanned: Boolean(row.is_banned ?? row.isBanned ?? false),
    achievements: (row.achievements as string[]) ?? [],
  };
}

function mapProfilePatch(patch: UpdateProfilePayload) {
  const row: Record<string, unknown> = {};

  if (patch.username !== undefined) row.username = patch.username;
  if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl;
  if (patch.bio !== undefined) row.bio = patch.bio;
  if (patch.role !== undefined) row.role = patch.role;
  if (patch.level !== undefined) row.level = patch.level;
  if (patch.wins !== undefined) row.wins = patch.wins;
  if (patch.losses !== undefined) row.losses = patch.losses;
  if (patch.elo !== undefined) row.elo = patch.elo;
  if (patch.isBanned !== undefined) row.is_banned = patch.isBanned;

  return row;
}

const gameSlugs: GameSlug[] = [
  'tic-tac-toe',
  'rock-paper-scissors',
  'memory-duel',
  'speed-reaction',
  'quiz-battle',
  'number-guess',
];

function toGameSlug(value: unknown): GameSlug {
  const slug = String(value ?? '');
  return gameSlugs.includes(slug as GameSlug) ? (slug as GameSlug) : 'tic-tac-toe';
}

function mapGameRow(row: Record<string, unknown>): Game {
  return {
    id: String(row.id ?? ''),
    slug: toGameSlug(row.slug),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    playersMin: Number(row.players_min ?? row.playersMin ?? 0),
    playersMax: Number(row.players_max ?? row.playersMax ?? 0),
    genre: String(row.genre ?? ''),
    realtime: Boolean(row.realtime ?? false),
    accent: String(row.accent ?? 'cyan'),
    rating: Number(row.rating ?? 0),
  };
}

function mapRoomRow(row: Record<string, unknown>): Room {
  return {
    id: String(row.id ?? ''),
    gameId: String(row.game_id ?? row.gameId ?? ''),
    name: String(row.name ?? ''),
    hostId: String(row.host_id ?? row.hostId ?? ''),
    status: (row.status as Room['status']) ?? 'open',
    maxPlayers: Number(row.max_players ?? row.maxPlayers ?? 0),
    currentPlayers: Number(row.current_players ?? row.currentPlayers ?? 0),
    code: String(row.code ?? ''),
    isPrivate: Boolean(row.is_private ?? row.isPrivate ?? false),
    board: Array.isArray(row.board) ? (row.board as string[]) : [],
    currentTurn: (row.current_turn as Room['currentTurn']) ?? 'X',
    winner: (row.winner as Room['winner']) ?? null,
    lastActivity: String(row.last_activity ?? row.lastActivity ?? new Date().toISOString()),
  };
}

function mapLeaderboardRow(row: Record<string, unknown>): LeaderboardEntry {
  return {
    id: String(row.id ?? ''),
    profileId: String(row.profile_id ?? row.profileId ?? ''),
    username: String(row.username ?? ''),
    avatarUrl: String(row.avatar_url ?? row.avatarUrl ?? ''),
    gameId: String(row.game_id ?? row.gameId ?? ''),
    points: Number(row.points ?? 0),
    wins: Number(row.wins ?? 0),
    matches: Number(row.matches ?? 0),
    rank: Number(row.rank ?? 0),
  };
}

function mapMessageRow(row: Record<string, unknown>): Message {
  return {
    id: String(row.id ?? ''),
    roomId: String(row.room_id ?? row.roomId ?? ''),
    senderId: String(row.sender_id ?? row.senderId ?? ''),
    senderName: String(row.sender_name ?? row.senderName ?? ''),
    content: String(row.content ?? ''),
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}

function mapNotificationRow(row: Record<string, unknown>): NotificationItem {
  return {
    id: String(row.id ?? ''),
    userId: String(row.user_id ?? row.userId ?? ''),
    title: String(row.title ?? ''),
    body: String(row.body ?? ''),
    readAt: (row.read_at ?? row.readAt ?? null) as string | null,
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}

function mapMatchRow(row: Record<string, unknown>): Match {
  return {
    id: String(row.id ?? ''),
    gameId: String(row.game_id ?? row.gameId ?? ''),
    roomId: String(row.room_id ?? row.roomId ?? ''),
    winnerId: (row.winner_id ?? row.winnerId ?? null) as string | null,
    status: (row.status as Match['status']) ?? 'pending',
    score: Number(row.score ?? 0),
    startedAt: String(row.started_at ?? row.startedAt ?? new Date().toISOString()),
    endedAt: (row.ended_at ?? row.endedAt ?? null) as string | null,
  };
}

async function getActiveSession() {
  if (hasSupabaseConfig) {
    return loadSession();
  }

  return readMockState().session;
}

export async function registerUser(payload: RegisterPayload) {
  if (!isValidEmail(payload.email)) {
    throw new Error('Please provide a valid email address.');
  }

  if (!isValidUsername(payload.username)) {
    throw new Error('Username must be 3-20 characters and contain only letters, numbers, or underscores.');
  }

  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        emailRedirectTo: import.meta.env.VITE_SITE_URL || window.location.origin,
        data: { username: payload.username },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      userId: data.user?.id ?? '',
      requiresVerification: !data.session,
    };
  }

  const session: AppSession = {
    userId: generateId('user'),
    email: payload.email,
    role: 'user',
  };

  setMockSession(session);
  updateMockState((state) => {
    const profile: Profile = {
      id: session.userId,
      username: payload.username,
      email: payload.email,
      avatarUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=${payload.username}`,
      role: 'user',
      bio: 'New challenger on the platform.',
      level: 1,
      wins: 0,
      losses: 0,
      elo: 1200,
      isBanned: false,
      achievements: [],
    };

    return {
      ...state,
      session,
      profiles: [profile, ...state.profiles],
    };
  });

  return {
    userId: session.userId,
    requiresVerification: false,
  };
}

export async function loginUser(payload: LoginPayload) {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword(payload);

    if (error) {
      throw new Error(error.message);
    }

    return data.session?.user?.id ?? '';
  }

  const state = readMockState();
  const profile = state.profiles.find((item) => item.email === payload.email);

  if (!profile) {
    throw new Error('Demo account not found. Please register first.');
  }

  const session: AppSession = {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
  };

  setMockSession(session);
  return session.userId;
}

export async function logoutUser() {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  setMockSession(null);
}

export async function requestPasswordReset(email: string) {
  if (!isValidEmail(email)) {
    throw new Error('Please provide a valid email address.');
  }

  if (supabase) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: import.meta.env.VITE_SITE_URL || window.location.origin,
    });

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  return;
}

export async function loadSession() {
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session?.user) return null;

    return {
      userId: session.user.id,
      email: session.user.email ?? '',
      role: (session.user.user_metadata?.role as Role) ?? 'user',
    } satisfies AppSession;
  }

  return readMockState().session;
}

export async function getCurrentProfile() {
  const session = await getActiveSession();
  if (!session) return null;

  if (supabase) {
    const { data } = await supabase.from('profiles').select('*').eq('id', session.userId).single();
    if (data) {
      return mapProfileRow(data as Record<string, unknown>);
    }
  }

  const state = readMockState();
  const profile = state.profiles.find((item) => item.id === session.userId);
  return profile ?? null;
}

export async function updateCurrentProfile(payload: UpdateProfilePayload) {
  const session = await getActiveSession();
  if (!session) throw new Error('No session available. Please sign in first.');

  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .update(mapProfilePatch(payload))
      .eq('id', session.userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data ? mapProfileRow(data as Record<string, unknown>) : null;
  }

  const state = updateMockState((draft) => ({
    ...draft,
    profiles: draft.profiles.map((profile) =>
      profile.id === session.userId ? { ...profile, ...payload } : profile,
    ),
  }));

  return state.profiles.find((item) => item.id === session.userId) ?? null;
}

export async function listGames(): Promise<Game[]> {
  if (supabase) {
    const { data, error } = await supabase.from('games').select('*').order('title');
    if (!error && data) return data.map((row) => mapGameRow(row as Record<string, unknown>));
  }

  return readMockState().games;
}

export async function listRooms(gameId?: string): Promise<Room[]> {
  if (supabase) {
    let query = supabase.from('game_rooms').select('*').order('last_activity', { ascending: false });
    if (gameId) query = query.eq('game_id', gameId);
    const { data, error } = await query;
    if (!error && data) return data.map((row) => mapRoomRow(row as Record<string, unknown>));
  }

  const rooms = readMockState().rooms;
  return gameId ? rooms.filter((room) => room.gameId === gameId) : rooms;
}

export async function createRoom(payload: RoomPayload) {
  const room: Room = {
    id: generateId('room'),
    gameId: payload.gameId,
    name: payload.name,
    hostId: payload.hostId,
    status: 'open',
    maxPlayers: payload.maxPlayers,
    currentPlayers: 1,
    code: Math.random().toString(36).slice(2, 8).toUpperCase(),
    isPrivate: payload.isPrivate ?? false,
    board: Array(9).fill(''),
    currentTurn: 'X',
    winner: null,
    lastActivity: new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase.from('game_rooms').insert(room).select().single();
    if (!error && data) return mapRoomRow(data as Record<string, unknown>);
  }

  updateMockState((state) => ({
    ...state,
    rooms: [room, ...state.rooms],
  }));

  return room;
}

export async function updateRoom(roomId: string, patch: Partial<Room>) {
  if (supabase) {
    const { data, error } = await supabase.from('game_rooms').update(patch).eq('id', roomId).select().single();
    if (!error && data) return mapRoomRow(data as Record<string, unknown>);
  }

  let updated: Room | null = null;
  updateMockState((state) => ({
    ...state,
    rooms: state.rooms.map((room) => {
      if (room.id !== roomId) return room;
      updated = { ...room, ...patch };
      return updated;
    }),
  }));

  return updated;
}

export async function deleteRoom(roomId: string) {
  if (supabase) {
    const { error } = await supabase.from('game_rooms').delete().eq('id', roomId);
    if (!error) return;
  }

  updateMockState((state) => ({
    ...state,
    rooms: state.rooms.filter((room) => room.id !== roomId),
  }));
}

export async function listLeaderboard(): Promise<LeaderboardEntry[]> {
  if (supabase) {
    const { data, error } = await supabase.from('leaderboard').select('*').order('rank');
    if (!error && data) return data.map((row) => mapLeaderboardRow(row as Record<string, unknown>));
  }

  return readMockState().leaderboard;
}

export async function listMessages(roomId: string): Promise<Message[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at');
    if (!error && data) return data.map((row) => mapMessageRow(row as Record<string, unknown>));
  }

  return readMockState().messages.filter((message) => message.roomId === roomId);
}

export async function sendMessage(roomId: string, content: string) {
  const session = await getActiveSession();
  if (!session) throw new Error('No session available. Please sign in first.');
  const state = readMockState();
  let sender: Profile | null = state.profiles.find((profile) => profile.id === session.userId) ?? null;

  if (supabase) {
    const { data } = await supabase.from('profiles').select('*').eq('id', session.userId).single();
    sender = data ? mapProfileRow(data as Record<string, unknown>) : null;
  }

  if (!sender) {
    throw new Error('Profile not found.');
  }

  const message: Message = {
    id: generateId('msg'),
    roomId,
    senderId: sender.id,
    senderName: sender.username,
    content,
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase.from('messages').insert(message).select().single();
    if (!error && data) return mapMessageRow(data as Record<string, unknown>);
  }

  updateMockState((draft) => ({
    ...draft,
    messages: [...draft.messages, message],
  }));

  return message;
}

export async function listProfiles(): Promise<Profile[]> {
  if (supabase) {
    const { data, error } = await supabase.from('profiles').select('*').order('username');
    if (!error && data) return data.map((row) => mapProfileRow(row as Record<string, unknown>));
  }

  return readMockState().profiles;
}

export async function updateUserRole(userId: string, role: Role) {
  if (supabase) {
    const { data, error } = await supabase.from('profiles').update({ role }).eq('id', userId).select().single();
    if (!error && data) return mapProfileRow(data as Record<string, unknown>);
  }

  let updated: Profile | null = null;
  updateMockState((state) => ({
    ...state,
    profiles: state.profiles.map((profile) => {
      if (profile.id !== userId) return profile;
      updated = { ...profile, role };
      return updated;
    }),
  }));

  return updated;
}

export async function banUser(userId: string, isBanned = true) {
  return updateProfileAdmin(userId, { isBanned });
}

export async function updateProfileAdmin(userId: string, patch: UpdateProfilePayload) {
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .update(mapProfilePatch(patch))
      .eq('id', userId)
      .select()
      .single();
    if (!error && data) return mapProfileRow(data as Record<string, unknown>);
  }

  let updated: Profile | null = null;
  updateMockState((state) => ({
    ...state,
    profiles: state.profiles.map((profile) => {
      if (profile.id !== userId) return profile;
      updated = { ...profile, ...patch };
      return updated;
    }),
  }));

  return updated;
}

export async function listNotifications(userId?: string): Promise<NotificationItem[]> {
  if (supabase) {
    const query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
    const { data, error } = userId ? await query.eq('user_id', userId) : await query;
    if (!error && data) return data.map((row) => mapNotificationRow(row as Record<string, unknown>));
  }

  const state = readMockState();
  return userId ? state.notifications.filter((item) => item.userId === userId) : state.notifications;
}

export async function markNotificationRead(notificationId: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single();
    if (!error && data) return mapNotificationRow(data as Record<string, unknown>);
  }

  let updated: NotificationItem | null = null;
  updateMockState((state) => ({
    ...state,
    notifications: state.notifications.map((item) => {
      if (item.id !== notificationId) return item;
      updated = { ...item, readAt: new Date().toISOString() };
      return updated;
    }),
  }));

  return updated;
}

export async function listMatches(userId?: string): Promise<Match[]> {
  if (supabase) {
    const query = supabase.from('matches').select('*').order('started_at', { ascending: false });
    const { data, error } = userId ? await query.or(`winner_id.eq.${userId}`) : await query;
    if (!error && data) return data.map((row) => mapMatchRow(row as Record<string, unknown>));
  }

  return readMockState().matches;
}

export async function listFriends(userId?: string): Promise<Friend[]> {
  const state = readMockState();
  if (!userId) return state.friends;
  return state.friends.filter((friend) => friend.requesterId === userId || friend.addresseeId === userId);
}

export async function createMatch(match: Match) {
  if (supabase) {
    const { data, error } = await supabase.from('matches').insert(match).select().single();
    if (!error && data) return mapMatchRow(data as Record<string, unknown>);
  }

  updateMockState((state) => ({
    ...state,
    matches: [match, ...state.matches],
  }));

  return match;
}
