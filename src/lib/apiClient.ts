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

export function getApiClient(getToken?: () => string | null): AxiosInstance {
  // Always create a fresh instance so request headers reflect the latest token
  const instance = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
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
    (error) => Promise.reject(error)
  );

  return instance;
}
