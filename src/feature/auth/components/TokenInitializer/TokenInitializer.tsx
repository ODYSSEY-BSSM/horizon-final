'use client';

import { useEffect } from 'react';
import { tokenStore } from '@/feature/auth/store/tokenStore';
import { apiClient } from '@/shared/api';

export function TokenInitializer() {
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = tokenStore.getRefreshToken();
      const accessToken = tokenStore.getAccessToken();

      // If we have a refresh token but no access token, try to refresh
      if (refreshToken && !accessToken) {
        await apiClient.refreshToken();
      }
    };

    initializeAuth();
  }, []);

  return null;
}
