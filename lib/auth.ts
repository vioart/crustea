const AUTH_TOKEN_KEY = "crustea_auth_token";
const AUTH_USER_KEY = "crustea_auth_user";

export type AuthUser = {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
};

export function setAuth(
  token: string,
  user?: AuthUser,
  remember = false,
) {
  if (typeof window === "undefined") {
    return;
  }

  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(AUTH_TOKEN_KEY, token);

  if (user) {
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  // Bersihkan storage lain agar tidak ada token ganda.
  const otherStorage = remember
    ? sessionStorage
    : localStorage;

  otherStorage.removeItem(AUTH_TOKEN_KEY);
  otherStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  );
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const userData =
    localStorage.getItem(AUTH_USER_KEY) ||
    sessionStorage.getItem(AUTH_USER_KEY);

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function clearAuth() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);

  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
}