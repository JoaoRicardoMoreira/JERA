import { apiRequest } from '@/lib/api/client';
import { sessionStorage } from '@/lib/storage/session-storage';
import { AuthResponse, AuthUser } from '@/types/bff.models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export const authService = {
  async login(request: LoginRequest) {
    const session = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify(request),
    });
    await sessionStorage.setSession(session);
    return session;
  },

  async register(request: RegisterRequest) {
    const session = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify(request),
    });
    await sessionStorage.setSession(session);
    return session;
  },

  async logout() {
    const refreshToken = await sessionStorage.getRefreshToken();

    try {
      await apiRequest<void>('/auth/logout', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ refreshToken: refreshToken ?? '' }),
      });
    } finally {
      await sessionStorage.clearSession();
    }
  },

  async me() {
    return apiRequest<AuthUser & { createdAt: string; updatedAt: string }>('/users/me');
  },
};
