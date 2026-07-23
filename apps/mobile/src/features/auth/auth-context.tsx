import { router } from 'expo-router';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { setSessionExpiredHandler } from '@/lib/api/client';
import { sessionStorage } from '@/lib/storage/session-storage';
import { AuthUser } from '@/types/bff.models';

import { authService, LoginRequest, RegisterRequest } from './auth.service';

type AuthContextValue = {
  user: AuthUser | null;
  bootstrapping: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshLocalUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      router.replace('/(auth)/login');
    });

    void restore();

    return () => setSessionExpiredHandler(null);
  }, []);

  async function restore() {
    try {
      const hasSession = await sessionStorage.hasSession();
      if (!hasSession) {
        setUser(null);
        return;
      }

      const currentUser = await sessionStorage.getUser();
      setUser(currentUser);
      void refreshLocalUser();
    } finally {
      setBootstrapping(false);
    }
  }

  async function login(request: LoginRequest) {
    const session = await authService.login(request);
    setUser(session.user);
  }

  async function register(request: RegisterRequest) {
    const session = await authService.register(request);
    setUser(session.user);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  async function refreshLocalUser() {
    const currentUser = await authService.me();
    const saved = await sessionStorage.getUser();
    setUser({ ...saved, ...currentUser });
  }

  const value = useMemo(
    () => ({ user, bootstrapping, login, register, logout, refreshLocalUser }),
    [user, bootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
