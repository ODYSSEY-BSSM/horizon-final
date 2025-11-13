import type { UserRole } from '@/shared/api/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface VerificationCodeRequest {
  email: string;
}

export interface VerificationRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface PasswordChangeRequest {
  password: string;
}

export interface UserInfoResponse {
  username: string;
  email: string;
  role: UserRole;
  teams: Array<{ id: number; name: string }>;
  school?: string;
  isConnectedSchool?: boolean;
}
