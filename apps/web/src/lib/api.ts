const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';

type Session = {
  accessToken: string;
  refreshToken: string;
  user?: { name: string; email: string; gender?: import('./types').Gender | null };
};
export const session = {
  get(): Session | null {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem('fc_session') ?? 'null');
    } catch {
      return null;
    }
  },
  set(value: Session) {
    localStorage.setItem('fc_session', JSON.stringify(value));
  },
  clear() {
    localStorage.removeItem('fc_session');
  },
};

async function parse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      Array.isArray(body?.message)
        ? body.message.join(', ')
        : body?.message || 'Nao foi possivel concluir a operacao.',
    );
  return (body?.data ?? body) as T;
}

export async function api<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const current = session.get();
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (current?.accessToken) headers.set('Authorization', `Bearer ${current.accessToken}`);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers, cache: 'no-store' });
  if (response.status === 401 && retry && current?.refreshToken && !path.startsWith('/auth/')) {
    try {
      const renewed = await api<Session>(
        '/auth/refresh',
        { method: 'POST', body: JSON.stringify({ refreshToken: current.refreshToken }) },
        false,
      );
      session.set(renewed);
      return api<T>(path, init, false);
    } catch {
      session.clear();
      window.location.href = '/login';
    }
  }
  return parse<T>(response);
}

export function money(value: string | number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(value),
  );
}
export function date(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));
}
export const decimal = (value: number) => value.toFixed(2);
