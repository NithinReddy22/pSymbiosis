// Client for the backend Auth API (proxied to localhost:8080 by Vite, see vite.config.ts).

export interface AuthUser {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
  user: AuthUser;
}

const STORAGE_KEY = 'psiog.auth';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let msg = res.status === 401 ? 'Invalid email or password' : `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      msg = body.message || body.error || msg;
    } catch { /* non-JSON body */ }
    throw new Error(msg);
  }
  const session: LoginResponse = await res.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): LoginResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session: LoginResponse = JSON.parse(raw);
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Authorization header for API calls, or an empty object when signed out. */
export function authHeader(): Record<string, string> {
  const s = getSession();
  return s ? { Authorization: `${s.tokenType} ${s.token}` } : {};
}

export const getCurrentUser = (): AuthUser | null => getSession()?.user ?? null;

/** "EMPLOYEE" -> "Employee", "DELIVERY_HEAD" -> "Delivery Head" */
export const formatRole = (role: string): string =>
  role.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export const initialsOf = (name: string): string =>
  name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
