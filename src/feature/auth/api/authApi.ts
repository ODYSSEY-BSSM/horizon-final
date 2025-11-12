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
} from '@/feature/auth/types/auth';
import { apiClient } from '@/shared/api';

export const authApi = {
  // ===================================
  // Auth API
  // ===================================

  // 로그인
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth', credentials, { auth: false });
    return response.data;
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    const response = await apiClient.put<TokenRefreshResponse>('/auth/token', null, {
      headers: {
        'Refresh-Token': refreshToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: false,
    });
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.delete('/auth');
  },

  // ===================================
  // User API
  // ===================================

  // 회원가입 인증 코드 요청
  requestVerificationCode: async (data: VerificationCodeRequest): Promise<void> => {
    await apiClient.post('/verification', data, { auth: false });
  },

  // 회원가입 인증 코드 인증
  verifyCode: async (data: VerificationRequest): Promise<void> => {
    await apiClient.patch('/verification', data, { auth: false });
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/users', data, { auth: false });
    return response.data;
  },

  // 비밀번호 변경 인증 코드 발송
  requestPasswordResetCode: async (data: VerificationCodeRequest): Promise<void> => {
    await apiClient.post('/verification/password', data, { auth: false });
  },

  // 비밀번호 변경 인증 코드 인증
  verifyPasswordResetCode: async (data: VerificationRequest): Promise<void> => {
    await apiClient.put('/verification', data, { auth: false });
  },

  // 유저 비밀번호 변경
  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    await apiClient.put('/users', data);
  },

  // 사용자 정보 조회
  getProfile: async (): Promise<UserInfoResponse> => {
    const response = await apiClient.get<UserInfoResponse>('/users');
    return response.data;
  },
};
