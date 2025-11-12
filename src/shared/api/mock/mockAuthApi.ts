/**
 * Mock Auth API (Swagger 완벽 일치)
 */

import { mockStorage } from './mockStorage';
import { initialMockData, type MockUser } from './mockData';
import { MOCK_DELAYS, delay } from './mockConstants';
import { MOCK_ERRORS } from './mockErrors';
import { UserRole } from '@/shared/api/types';
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

// localStorage에서 데이터 가져오기
function getUsers(): MockUser[] {
  return mockStorage.getOrDefault('users', initialMockData.users);
}

function getCurrentUser(): MockUser | null {
  return mockStorage.get<MockUser>('currentUser');
}

function setCurrentUser(user: MockUser | null): void {
  mockStorage.set('currentUser', user);
}

function getVerificationCodes(): Map<string, string> {
  const stored = mockStorage.get<[string, string][]>('verificationCodes');
  return stored ? new Map(stored) : new Map();
}

function setVerificationCodes(codes: Map<string, string>): void {
  mockStorage.set('verificationCodes', Array.from(codes.entries()));
}

// 가짜 JWT 생성
const generateToken = (userId: number): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

export const mockAuthApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await delay(MOCK_DELAYS.SLOW);

    const users = getUsers();
    const user = users.find((u) => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error(MOCK_ERRORS.INVALID_CREDENTIALS);
    }

    setCurrentUser(user);

    return {
      accessToken: generateToken(user.id),
      refreshToken: generateToken(user.id),
    };
  },

  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error(MOCK_ERRORS.INVALID_REFRESH_TOKEN);
    }

    return {
      accessToken: generateToken(currentUser.id),
      refreshToken: generateToken(currentUser.id),
    };
  },

  logout: async (): Promise<void> => {
    await delay(MOCK_DELAYS.FAST);
    setCurrentUser(null);
  },

  requestVerificationCode: async (data: VerificationCodeRequest): Promise<void> => {
    await delay(MOCK_DELAYS.SLOW);
    const code = process.env.NEXT_PUBLIC_DEV_VERIFICATION_CODE || '123456';

    const verificationCodes = getVerificationCodes();
    verificationCodes.set(data.email, code);
    setVerificationCodes(verificationCodes);

    // 개발 환경에서 콘솔에 인증 코드 출력
    if (process.env.NODE_ENV === 'development') {
      // biome-ignore lint/suspicious/noConsoleLog: Development debugging
      console.log(`[DEV] Verification code for ${data.email}: ${code}`);
    }
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    await delay(MOCK_DELAYS.SLOW);

    const users = getUsers();
    const existingUser = users.find((u) => u.email === data.email);

    if (existingUser) {
      throw new Error(MOCK_ERRORS.EMAIL_ALREADY_EXISTS);
    }

    const newUser: MockUser = {
      id: mockStorage.getNextId(),
      email: data.email,
      password: data.password,
      username: data.username,
      role: UserRole.USER,
      teamIds: [],
    };

    users.push(newUser);
    mockStorage.set('users', users);

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };
  },

  verifyCode: async (data: VerificationRequest): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);

    const verificationCodes = getVerificationCodes();
    const storedCode = verificationCodes.get(data.email);

    if (!storedCode || storedCode !== data.code) {
      throw new Error(MOCK_ERRORS.INVALID_VERIFICATION_CODE);
    }

    // 인증 성공 후 코드 삭제
    verificationCodes.delete(data.email);
    setVerificationCodes(verificationCodes);
  },

  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    await delay(MOCK_DELAYS.SLOW);

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].password = data.password;
      mockStorage.set('users', users);
    }
  },

  getProfile: async (): Promise<UserInfoResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }

    return {
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
      teams: [],
      school: undefined,
      isConnectedSchool: false,
    };
  },
};
