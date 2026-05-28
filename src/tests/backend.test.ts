import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  banUser,
  createMatch,
  createRoom,
  deleteRoom,
  getCurrentProfile,
  listFriends,
  listGames,
  listLeaderboard,
  listMatches,
  listMessages,
  listNotifications,
  listProfiles,
  listRooms,
  loadSession,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  requestPasswordReset,
  sendMessage,
  updateCurrentProfile,
  updateProfileAdmin,
  updateRoom,
  updateUserRole,
} from '../services/backend';
vi.mock('../api/supabase', () => ({
  supabase: null,
  hasSupabaseConfig: false,
}));

import { readMockState } from '../services/mockStore';

beforeEach(() => {
  window.localStorage.clear();
});

describe('backend fallback services', () => {
  it('registers, logs in, and loads the current profile in demo mode', async () => {
    const result = await registerUser({
      email: 'rookie@example.com',
      password: 'Strong123',
      username: 'rookie_player',
    });

    expect(result.requiresVerification).toBe(false);
    expect(await loadSession()).toMatchObject({
      email: 'rookie@example.com',
      role: 'user',
    });
    expect(await getCurrentProfile()).toMatchObject({
      email: 'rookie@example.com',
      username: 'rookie_player',
    });

    await logoutUser();
    expect(await loadSession()).toBeNull();
    await expect(loginUser({ email: 'rookie@example.com', password: 'Strong123' })).resolves.toBeTruthy();
  });

  it('validates auth input and password reset requests', async () => {
    await expect(
      registerUser({ email: 'bad-email', password: 'Strong123', username: 'player_one' }),
    ).rejects.toThrow(/valid email/i);
    await expect(
      registerUser({ email: 'player@example.com', password: 'Strong123', username: 'x' }),
    ).rejects.toThrow(/username/i);
    await expect(requestPasswordReset('bad-email')).rejects.toThrow(/valid email/i);
  });

  it('reads lists from the demo store', async () => {
    expect((await listGames()).length).toBeGreaterThan(0);
    expect((await listRooms()).length).toBeGreaterThan(0);
    expect((await listLeaderboard()).length).toBeGreaterThan(0);
    expect((await listProfiles()).length).toBeGreaterThan(0);
    expect((await listMessages('room-101')).length).toBeGreaterThan(0);
    expect((await listNotifications('user-anna')).length).toBeGreaterThan(0);
    expect((await listMatches('user-anna')).length).toBeGreaterThan(0);
    expect((await listFriends('user-anna')).length).toBeGreaterThan(0);
  });

  it('creates and updates rooms and messages', async () => {
    await registerUser({
      email: 'coverage@example.com',
      password: 'Strong123',
      username: 'coverage_player',
    });

    const room = await createRoom({
      gameId: 'game-ttt',
      name: 'Coverage Room',
      maxPlayers: 2,
      hostId: 'user-anna',
    });

    expect(room.name).toBe('Coverage Room');

    const updatedRoom = await updateRoom(room.id, {
      status: 'playing',
      currentPlayers: 2,
    });
    expect(updatedRoom?.status).toBe('playing');
    expect(updatedRoom?.currentPlayers).toBe(2);

    await updateCurrentProfile({
      bio: 'Updated bio for coverage',
      username: 'anna_updated',
      elo: 1701,
    });

    const message = await sendMessage(room.id, 'Good luck!');
    expect(message.content).toBe('Good luck!');

    const roomMessages = await listMessages(room.id);
    expect(roomMessages.some((item) => item.id === message.id)).toBe(true);

    await deleteRoom(room.id);
    expect((await listRooms()).some((item) => item.id === room.id)).toBe(false);
  });

  it('updates admin and notification state', async () => {
    const profile = await updateUserRole('user-anna', 'admin');
    expect(profile?.role).toBe('admin');

    const banned = await banUser('user-anna', true);
    expect(banned?.isBanned).toBe(true);

    const patched = await updateProfileAdmin('user-anna', { bio: 'Moderated', wins: 49 });
    expect(patched?.bio).toBe('Moderated');
    expect(patched?.wins).toBe(49);

    const notifications = await listNotifications('user-anna');
    const target = notifications[0];
    const read = await markNotificationRead(target.id);
    expect(read?.readAt).toBeTruthy();
  });

  it('creates matches', async () => {
    const state = readMockState();
    const match = await createMatch({
      id: 'match-coverage',
      gameId: state.games[0].id,
      roomId: state.rooms[0].id,
      winnerId: state.profiles[0].id,
      status: 'finished',
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      score: 99,
    });

    expect(match.id).toBe('match-coverage');
  });
});
