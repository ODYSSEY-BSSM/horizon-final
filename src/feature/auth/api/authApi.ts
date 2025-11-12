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
import { mockAuthApi } from '@/shared/api/mock/mockAuthApi';

// Mock API 사용 (실제 API 대신)
export const authApi = mockAuthApi;
