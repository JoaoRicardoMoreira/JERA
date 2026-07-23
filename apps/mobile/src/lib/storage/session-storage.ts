import * as SecureStore from 'expo-secure-store';

import { AuthResponse, AuthUser } from '@/types/bff.models';

const ACCESS_TOKEN_KEY = 'jera.accessToken';
const REFRESH_TOKEN_KEY = 'jera.refreshToken';
const USER_KEY = 'jera.user';

export const sessionStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async getUser(): Promise<AuthUser | null> {
    const serialized = await SecureStore.getItemAsync(USER_KEY);

    if (!serialized) {
      return null;
    }

    try {
      return JSON.parse(serialized) as AuthUser;
    } catch {
      await this.clearSession();
      return null;
    }
  },

  async setSession(session: AuthResponse) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user)),
    ]);
  },

  async clearSession() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },

  async hasSession() {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
    ]);

    return Boolean(accessToken && refreshToken);
  },
};
