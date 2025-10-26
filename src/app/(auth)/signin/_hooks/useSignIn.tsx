'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoginRequest, LoginResponse, UserInfoResponse } from '@/core/api';
import { apiClient, userApi } from '@/core/api';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => userApi.login(data),
    onSuccess: (loginResponse: LoginResponse) => {
      localStorage.setItem('accessToken', loginResponse.accessToken);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
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
