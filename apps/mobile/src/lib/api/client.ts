import { env } from '@/config/env';
import { sessionStorage } from '@/lib/storage/session-storage';
import { ApiResponse, AuthResponse } from '@/types/bff.models';

import { ApiClientError, toApiClientError } from './errors';

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

let onSessionExpired: (() => void) | null = null;
let refreshInFlight: Promise<AuthResponse> | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return requestWithAuth<T>(path, options);
}

async function requestWithAuth<T>(path: string, options: RequestOptions): Promise<T> {
  const response = await executeRequest<T>(path, options);

  if (!(response instanceof ApiClientError)) {
    return response;
  }

  if (
    response.details.statusCode !== 401 ||
    options.skipRefresh ||
    path.includes('/auth/refresh')
  ) {
    throw response;
  }

  try {
    await refreshSession();
    const retry = await executeRequest<T>(path, { ...options, skipRefresh: true });

    if (retry instanceof ApiClientError) {
      throw retry;
    }

    return retry;
  } catch (error) {
    await sessionStorage.clearSession();
    onSessionExpired?.();
    throw error;
  }
}

async function executeRequest<T>(
  path: string,
  { skipAuth, skipRefresh: _skipRefresh, headers, body, ...options }: RequestOptions,
): Promise<T | ApiClientError> {
  const accessToken = skipAuth ? null : await sessionStorage.getAccessToken();
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    body,
    headers: {
      Accept: 'application/json',
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    return toApiClientError(response.status, payload);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

async function refreshSession(): Promise<AuthResponse> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = await sessionStorage.getRefreshToken();

      if (!refreshToken) {
        throw toApiClientError(401, null);
      }

      const session = await executeRequest<AuthResponse>('/auth/refresh', {
        method: 'POST',
        skipAuth: true,
        skipRefresh: true,
        body: JSON.stringify({ refreshToken }),
      });

      if (session instanceof ApiClientError) {
        throw session;
      }

      await sessionStorage.setSession(session);
      return session;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}
