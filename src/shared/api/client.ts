import { tokenStore } from '@/feature/auth';
import { mockAuthApi } from './mock/mockAuthApi';

/**
 * API Client
 * Note: Mock API 사용으로 인해 HTTP 요청 메서드(get, post, put, delete, patch)는 제거됨
 * tokenStore와 token refresh 기능만 유지
 */
class ApiClient {
  private accessToken: string | null = null;

  constructor() {
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

  async tryRefreshToken(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }

    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await mockAuthApi.refreshToken(refreshToken);
      const newAccessToken = response.accessToken;
      const newRefreshToken = response.refreshToken;

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
