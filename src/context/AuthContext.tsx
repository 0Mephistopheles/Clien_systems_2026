import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import type { AppSession, Profile, Role } from '../types';
import {
  loadSession,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  updateCurrentProfile,
} from '../services/authService';
import { getCurrentProfile } from '../services/profileService';
import { readMockState } from '../services/mockStore';

type AuthState = {
  session: AppSession | null;
  profile: Profile | null;
  loading: boolean;
};

type RegisterPayload = {
  email: string;
  password: string;
  username: string;
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ requiresVerification: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  ensureRole: (roles: Role[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    profile: null,
    loading: true,
  });

  const hydrate = useCallback(async () => {
    const session = await loadSession();
    const profile = await getCurrentProfile();
    setState({
      session,
      profile,
      loading: false,
    });
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const login = async (email: string, password: string) => {
    await loginUser({ email, password });
    await hydrate();
    toast.success('Logged in successfully.');
  };

  const register = async (payload: RegisterPayload) => {
    const result = await registerUser(payload);
    await hydrate();
    toast.success(
      result.requiresVerification
        ? 'Registration complete. Please verify your email to continue.'
        : 'Demo account created and signed in.',
    );
    return result;
  };

  const logout = async () => {
    await logoutUser();
    await hydrate();
    toast('Signed out.');
  };

  const resetPassword = async (email: string) => {
    await requestPasswordReset(email);
    toast.success('Password reset email requested.');
  };

  const refreshProfile = async () => {
    const profile = await getCurrentProfile();
    setState((current) => ({
      ...current,
      profile,
    }));
  };

  const updateProfile = async (patch: Partial<Profile>) => {
    const profile = await updateCurrentProfile(patch);
    setState((current) => ({
      ...current,
      profile,
    }));
    toast.success('Profile updated.');
  };

  const value: AuthContextValue = {
    ...state,
    isAuthenticated: Boolean(state.session),
    isAdmin: state.profile?.role === 'admin',
    login,
    register,
    logout,
    resetPassword,
    refreshProfile,
    updateProfile,
    ensureRole: (roles: Role[]) => Boolean(state.profile && roles.includes(state.profile.role)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useDemoUser() {
  return readMockState().profiles[0] ?? null;
}
