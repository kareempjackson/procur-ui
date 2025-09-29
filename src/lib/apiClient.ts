import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";

let apiClientInstance: AxiosInstance | null = null;

function getBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Default to local NestJS with prefix and version
  return "http://localhost:3000/api/v1";
}

export function getApiClient(getToken?: () => string | null): AxiosInstance {
  if (apiClientInstance) return apiClientInstance;

  const instance = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (getToken) {
      const token = getToken();
      if (token) {
        (config.headers as AxiosRequestHeaders)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // You can centralize 401 handling here later
      return Promise.reject(error);
    }
  );

  apiClientInstance = instance;
  return instance;
}
