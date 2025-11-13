import { apiClient } from '@/shared/api/client';
import type {
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  RegisterRequest,
  RegisterResponse,
  TokenRefreshResponse,
  UserInfoResponse,
  VerificationCodeRequest,
  VerificationRequest,
} from '../types/auth';

export const realAuthApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth', credentials);
  },

  logout: async (): Promise<void> => {
    return apiClient.delete<void>('/auth');
  },

  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    return apiClient.put<TokenRefreshResponse>(
      '/auth/token',
      {},
      {
        headers: {
          'Refresh-Token': refreshToken,
        },
      },
    );
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/users', data);
  },

  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    return apiClient.put<void>('/users', data);
  },

  getProfile: async (): Promise<UserInfoResponse> => {
    return apiClient.get<UserInfoResponse>('/users');
  },

  connectSchool: async (): Promise<UserInfoResponse> => {
    return apiClient.put<UserInfoResponse>('/users/school');
  },

  requestVerificationCode: async (data: VerificationCodeRequest): Promise<void> => {
    return apiClient.post<void>('/verification', data);
  },

  requestPasswordResetCode: async (data: VerificationCodeRequest): Promise<void> => {
    return apiClient.post<void>('/verification/password', data);
  },

  verifyCode: async (data: VerificationRequest): Promise<void> => {
    return apiClient.patch<void>('/verification', data);
  },

  verifyPasswordUpdate: async (data: VerificationRequest): Promise<void> => {
    return apiClient.put<void>('/verification', data);
  },
};
