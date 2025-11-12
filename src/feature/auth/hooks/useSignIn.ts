import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, tokenStore } from '@/feature/auth';
import type { LoginRequest, LoginResponse, UserInfoResponse } from '@/feature/auth/types/auth';
import { apiClient } from '@/shared/api';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
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
    mutationFn: authApi.logout,
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
    queryFn: authApi.getProfile,
    retry: false,
  });
};
