'use client';

import { useEffect } from 'react';
import { authApi } from '@/feature/auth/api/authApi';
import { apiClient, tokenStore } from '@/shared/api';

export function TokenInitializer() {
  useEffect(() => {
    const initializeAuth = async () => {
      // Initialize token in apiClient first
      apiClient.initializeToken();

      const refreshToken = tokenStore.getRefreshToken();
      const accessToken = tokenStore.getAccessToken();

      if (refreshToken && !accessToken) {
        try {
          const response = await authApi.refreshToken(refreshToken);
          const newAccessToken = response.accessToken;
          const newRefreshToken = response.refreshToken;

          tokenStore.setTokens(newAccessToken, newRefreshToken);
          apiClient.setAccessToken(newAccessToken);
        } catch (_error) {
          tokenStore.clearTokens();
        }
      }
    };

    initializeAuth();
  }, []);

  return null;
}
