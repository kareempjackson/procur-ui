import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";

function getBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Default to local NestJS with prefix and version
  return "http://localhost:3000/api/v1";
}

function defaultGetToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { accessToken?: string };
    return parsed.accessToken ?? null;
  } catch {
    return null;
  }
}

// ─── Refresh token logic ──────────────────────────────────────────────────────

// Deduplicates concurrent 401s: all in-flight requests that get 401 wait on
// the same single refresh call instead of each triggering their own.
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      if (typeof window === "undefined") return null;
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      const stored = JSON.parse(raw) as { refreshToken?: string };
      if (!stored.refreshToken) return null;

      const res = await axios.post(
        `${getBaseUrl()}/auth/refresh`,
        { refreshToken: stored.refreshToken },
        { timeout: 10000 }
      );

      const {
        accessToken,
        expiresIn,
        refreshToken: newRefreshToken,
      } = res.data as {
        accessToken: string;
        expiresIn: number;
        refreshToken: string;
      };

      // Patch localStorage — keep user/tokenType, update tokens
      const current = JSON.parse(localStorage.getItem("auth") || "{}");
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...current, accessToken, expiresIn, refreshToken: newRefreshToken })
      );

      return accessToken;
    } catch {
      // Refresh failed — clear auth and send to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
        window.location.href = "/login?reason=session_expired";
      }
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─────────────────────────────────────────────────────────────────────────────

export function getApiClient(getToken?: () => string | null): AxiosInstance {
  // Always create a fresh instance so request headers reflect the latest token
  const instance = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    timeout: 15000, // 15s — requests that exceed this reject instead of hanging forever
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken ? getToken() : defaultGetToken();
    if (token) {
      (config.headers as AxiosRequestHeaders)["Authorization"] =
        `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      // On 401, attempt a silent token refresh then retry the original request once
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        const newToken = await tryRefreshToken();
        if (newToken) {
          (original.headers as AxiosRequestHeaders)["Authorization"] = `Bearer ${newToken}`;
          return instance(original);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
