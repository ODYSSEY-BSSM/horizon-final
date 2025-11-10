import { apiClient } from '@/shared/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenRefreshResponse,
  UserInfoResponse,
} from '../types/auth';

export const authApi = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth', credentials);
    return response.data;
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post('/user', data);
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    const response = await apiClient.put<TokenRefreshResponse>('/auth/token', null, {
      headers: {
        'Refresh-Token': refreshToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.delete('/auth', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  // 사용자 정보 조회
  getProfile: async (): Promise<UserInfoResponse> => {
    const response = await apiClient.get<UserInfoResponse>('/user/profile');
    return response.data;
  },
};
