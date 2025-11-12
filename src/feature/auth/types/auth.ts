import type { UserRole } from '@/shared/api/types';

// ===================================
// Auth API Types
// ===================================

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// Token Refresh
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// ===================================
// User API Types
// ===================================

// Verification Code
export interface VerificationCodeRequest {
  email: string;
}

export interface VerificationRequest {
  email: string;
  code: string;
}

// Register / Sign Up
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

// Password Change
export interface PasswordChangeRequest {
  password: string;
}

// User Profile
export interface UserInfoResponse {
  username: string;
  email: string;
  role: UserRole;
  teams: string[];
  school?: string; // 학교 연동 후에만 존재
  isConnectedSchool?: boolean; // 학교 연동 여부
}
