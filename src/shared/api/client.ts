import { tokenStore } from '@/feature/auth';
import type { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * API Client with HTTP methods
 * Supports both mock and real API calls
 */
class ApiClient {
  private accessToken: string | null = null;
  private baseURL: string;

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

  private getHeaders(options?: RequestOptions): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);

    const requestOptions: RequestInit = {
      method,
      headers: this.getHeaders(options),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, requestOptions);

    // Handle 401 - Try to refresh token
    if (response.status === 401 && endpoint !== '/auth/token') {
      const refreshed = await this.tryRefreshToken();
      if (refreshed) {
        // Retry the request with new token
        return this.request<T>(method, endpoint, data, options);
      }
      throw new Error('Authentication failed');
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON response
    const result: ApiResponse<T> = await response.json();

    // Handle non-OK responses
    if (!response.ok || result.code !== 'OK') {
      throw new Error(result.message || 'Request failed');
    }

    return result.data;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  async tryRefreshToken(): Promise<boolean> {
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
          'Content-Type': 'application/json',
          'Refresh-Token': refreshToken,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result: ApiResponse<{ accessToken: string; refreshToken: string }> =
        await response.json();

      if (result.code !== 'OK') {
        throw new Error(result.message || 'Token refresh failed');
      }

      const newAccessToken = result.data.accessToken;
      const newRefreshToken = result.data.refreshToken;

      tokenStore.setTokens(newAccessToken, newRefreshToken);
      this.accessToken = newAccessToken;

      return true;
    } catch (_error) {
      // Token refresh failed
      tokenStore.clearTokens();
      this.accessToken = null;

      return false;
    }
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
