'use client';

import { useEffect } from 'react';
import { tokenStore } from '@/feature/auth/store/tokenStore';
import { apiClient } from '@/shared/api';

export function TokenInitializer() {
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = tokenStore.getRefreshToken();
      const accessToken = tokenStore.getAccessToken();

      if (refreshToken && !accessToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/auth/token`,
            {
              method: 'PUT',
              headers: {
                'Refresh-Token': refreshToken,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            const newAccessToken = data.data.accessToken;
            const newRefreshToken = data.data.refreshToken;

            tokenStore.setTokens(newAccessToken, newRefreshToken);
            apiClient.setAccessToken(newAccessToken);
          } else {
            tokenStore.clearTokens();
          }
        } catch (_error) {
          tokenStore.clearTokens();
        }
      }
    };

    initializeAuth();
  }, []);

  return null;
}
