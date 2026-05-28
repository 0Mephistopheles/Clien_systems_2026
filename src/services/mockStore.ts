import {
  demoAchievements,
  demoFriends,
  demoGames,
  demoLeaderboard,
  demoMatches,
  demoMessages,
  demoNotifications,
  demoProfiles,
  demoRooms,
} from '../data/mockData';
import type {
  Achievement,
  AppSession,
  Friend,
  Game,
  LeaderboardEntry,
  Match,
  Message,
  NotificationItem,
  Profile,
  Room,
} from '../types';
import { readStorage, writeStorage } from '../utils/storage';

export type MockState = {
  session: AppSession | null;
  games: Game[];
  profiles: Profile[];
  rooms: Room[];
  messages: Message[];
  leaderboard: LeaderboardEntry[];
  matches: Match[];
  notifications: NotificationItem[];
  friends: Friend[];
  achievements: Achievement[];
};

const defaultState: MockState = {
  session: null,
  games: demoGames,
  profiles: demoProfiles,
  rooms: demoRooms,
  messages: demoMessages,
  leaderboard: demoLeaderboard,
  matches: demoMatches,
  notifications: demoNotifications,
  friends: demoFriends,
  achievements: demoAchievements,
};

const STORAGE_KEY = 'mmp.mock.state';
const SESSION_KEY = 'mmp.mock.session';

function cloneState(state: MockState): MockState {
  return JSON.parse(JSON.stringify(state)) as MockState;
}

export function readMockState() {
  const state = readStorage<MockState>(STORAGE_KEY, defaultState);
  const session = readStorage<AppSession | null>(SESSION_KEY, state.session);
  return { ...state, session };
}

export function writeMockState(nextState: MockState) {
  const snapshot = cloneState(nextState);
  writeStorage(STORAGE_KEY, snapshot);
  writeStorage(SESSION_KEY, snapshot.session);
  return snapshot;
}

export function updateMockState(mutator: (state: MockState) => MockState) {
  const current = readMockState();
  const next = mutator(cloneState(current));
  return writeMockState(next);
}

export function resetMockSession() {
  updateMockState((state) => ({
    ...state,
    session: null,
  }));
}

export function setMockSession(session: AppSession | null) {
  updateMockState((state) => ({
    ...state,
    session,
  }));
}

export function generateId(prefix: string) {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);

  return `${prefix}-${random}`;
}
