import { CONFIG } from "./config";

interface RequestOptions extends RequestInit {
  data?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const url = `${CONFIG.API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseData.message || "Something went wrong",
        responseData,
      );
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : "Network error");
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", data }),
  put: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", data }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
  patch: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PATCH", data }),
};
