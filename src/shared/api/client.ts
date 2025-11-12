import { tokenStore } from '@/feature/auth';
import type { ApiResponse } from './types';

export interface ApiClientRequestInit extends RequestInit {
  auth?: boolean;
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// API Client class
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.initializeToken();
  }

  private initializeToken() {
    if (typeof window !== 'undefined') {
      const token = tokenStore.getAccessToken();
      if (token) {
        this.accessToken = token;
      }
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: ApiClientRequestInit = {},
  ): Promise<ApiResponse<T>> {
    const { auth = true, ...restOptions } = options;
    // Always get the latest token from tokenStore (in-memory)
    if (typeof window !== 'undefined') {
      const token = tokenStore.getAccessToken();
      if (token && token !== this.accessToken) {
        this.accessToken = token;
      }
    }

    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken && auth) {
      defaultHeaders.Authorization = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...restOptions,
      headers: {
        ...defaultHeaders,
        ...restOptions.headers,
      },
    };

    const response = await fetch(url, config);

    // Handle token refresh for 401 errors
    if (response.status === 401 && auth) {
      const refreshed = await this.tryRefreshToken();
      if (refreshed) {
        // Retry the request with new token
        const newHeaders = {
          ...defaultHeaders,
          Authorization: `Bearer ${this.accessToken}`,
          ...options.headers,
        };

        const retryConfig: RequestInit = {
          ...restOptions,
          headers: newHeaders,
        };

        const retryResponse = await fetch(url, retryConfig);
        if (!retryResponse.ok) {
          throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
        }

        // Handle empty response body
        const retryText = await retryResponse.text();
        if (!retryText || retryText.length === 0) {
          return { code: 'OK', message: 'success', data: undefined as T };
        }

        // Parse JSON response
        let retryResult: ApiResponse<T>;
        try {
          retryResult = JSON.parse(retryText);
        } catch (_error) {
          throw new Error('Failed to parse response JSON');
        }

        // Check API response code
        if (retryResult.code !== 'OK') {
          throw new Error(retryResult.message || `API Error: ${retryResult.code}`);
        }

        return retryResult;
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle empty response body
    const text = await response.text();
    if (!text || text.length === 0) {
      return { code: 'OK', message: 'success', data: undefined as T };
    }

    // Parse JSON response
    let result: ApiResponse<T>;
    try {
      result = JSON.parse(text);
    } catch (_error) {
      throw new Error('Failed to parse response JSON');
    }

    // Check API response code (서버가 200 OK지만 body에 에러를 담아 보낼 수 있음)
    if (result.code !== 'OK') {
      throw new Error(result.message || `API Error: ${result.code}`);
    }

    return result;
  }

  private async tryRefreshToken(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }

    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/token`, {
        method: 'PUT',
        headers: {
          'Refresh-Token': refreshToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // 보안 개선: tokenStore 사용
        tokenStore.setTokens(newAccessToken, newRefreshToken);
        this.accessToken = newAccessToken;

        return true;
      }
    } catch (_error) {
      // Token refresh failed
    }

    // Refresh failed, clear tokens
    tokenStore.clearTokens();
    this.accessToken = null;

    return false;
  }

  async get<T>(endpoint: string, options?: ApiClientRequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiClientRequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiClientRequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: ApiClientRequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiClientRequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
