import type { ApiErrorBody, AuthSession } from "@/lib/api/types";

// Thin fetch wrapper implementing the dual-JWT scheme from
// docs/architecture.md: bearer auth token on every request, and on a 401
// a single refresh-and-retry using the long-lived refresh token.
// Components never call this directly — they use the TanStack Query
// hooks in src/lib/api/auth.ts.

const AUTH_TOKEN_KEY = "vm.authToken";
const REFRESH_TOKEN_KEY = "vm.refreshToken";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.error);
    this.status = status;
    this.fieldErrors = body.fieldErrors;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeSession(session: AuthSession): void {
  localStorage.setItem(AUTH_TOKEN_KEY, session.authToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasSession(): boolean {
  return getRefreshToken() !== null || getAuthToken() !== null;
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

async function rawFetch(path: string, options: ApiFetchOptions) {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(path, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

// Deduplicate concurrent refreshes so parallel 401s trigger one rotation.
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  refreshInFlight ??= (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    const response = await rawFetch("/api/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
    if (!response.ok) {
      clearSession();
      return false;
    }
    storeSession((await response.json()) as AuthSession);
    return true;
  })().finally(() => {
    setTimeout(() => (refreshInFlight = null), 0);
  });
  return refreshInFlight;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  let response = await rawFetch(path, options);

  if (response.status === 401 && options.auth && (await tryRefresh())) {
    response = await rawFetch(path, options);
  }

  if (!response.ok) {
    let body: ApiErrorBody;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = { error: "Something went wrong. Please try again." };
    }
    throw new ApiError(response.status, body);
  }

  return (await response.json()) as T;
}
