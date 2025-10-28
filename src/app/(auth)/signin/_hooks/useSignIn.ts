'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoginRequest, LoginResponse, UserInfoResponse } from '@/core/api';
import { apiClient, userApi } from '@/core/api';
import { tokenStore } from '@/core/auth/tokenStore';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => userApi.login(data),
    onSuccess: (loginResponse: LoginResponse) => {
      // 보안 개선: accessToken은 메모리, refreshToken은 sessionStorage
      tokenStore.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
      apiClient.setAccessToken(loginResponse.accessToken);

      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.logout,
    onSettled: () => {
      // 보안 개선: tokenStore에서 토큰 제거
      tokenStore.clearTokens();
      apiClient.setAccessToken(null);

      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });
};

export const useUserProfile = () => {
  return useQuery<UserInfoResponse>({
    queryKey: ['user', 'profile'],
    queryFn: userApi.getProfile,
    retry: false,
  });
};
