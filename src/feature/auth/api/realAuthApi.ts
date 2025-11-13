/**
 * Real Auth API Implementation
 */

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
  // POST /auth - Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth', credentials);
  },

  // DELETE /auth - Logout
  logout: async (): Promise<void> => {
    return apiClient.delete<void>('/auth');
  },

  // PUT /auth/token - Refresh token
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

  // POST /users - Register/Sign up
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/users', data);
  },

  // PUT /users - Change password
  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    return apiClient.put<void>('/users', data);
  },

  // GET /users - Get user profile
  getProfile: async (): Promise<UserInfoResponse> => {
    return apiClient.get<UserInfoResponse>('/users');
  },

  // PUT /users/school - Connect school account
  connectSchool: async (): Promise<UserInfoResponse> => {
    return apiClient.put<UserInfoResponse>('/users/school');
  },

  // POST /verification - Send verification code
  requestVerificationCode: async (data: VerificationCodeRequest): Promise<void> => {
    return apiClient.post<void>('/verification', data);
  },

  // POST /verification/password - Send password reset code
  requestPasswordResetCode: async (data: VerificationCodeRequest): Promise<void> => {
    return apiClient.post<void>('/verification/password', data);
  },

  // PATCH /verification - Verify code
  verifyCode: async (data: VerificationRequest): Promise<void> => {
    return apiClient.patch<void>('/verification', data);
  },

  // PUT /verification - Verify password update
  verifyPasswordUpdate: async (data: VerificationRequest): Promise<void> => {
    return apiClient.put<void>('/verification', data);
  },
};
