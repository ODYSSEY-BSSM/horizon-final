/**
 * Mock Auth API (Swagger 완벽 일치)
 */

import { mockStorage } from './mockStorage';
import { initialMockData, type MockUser } from './mockData';
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
  return mockStorage.get<MockUser[]>('users') || initialMockData.users;
}

function getCurrentUser(): MockUser | null {
  return mockStorage.get<MockUser>('currentUser');
}

function setCurrentUser(user: MockUser | null): void {
  mockStorage.set('currentUser', user);
}

// 가짜 JWT 생성
const generateToken = (userId: number): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

// 인증 코드 저장소
const verificationCodes = new Map<string, string>();

export const mockAuthApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = getUsers();
    const user = users.find((u) => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    setCurrentUser(user);

    return {
      accessToken: generateToken(user.id),
      refreshToken: generateToken(user.id),
    };
  },

  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('인증이 필요합니다.');
    }

    return {
      accessToken: generateToken(currentUser.id),
      refreshToken: generateToken(currentUser.id),
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    setCurrentUser(null);
  },

  requestVerificationCode: async (data: VerificationCodeRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const code = process.env.NEXT_PUBLIC_DEV_VERIFICATION_CODE || '123456';
    verificationCodes.set(data.email, code);
    console.log(`[Mock] 인증 코드: ${code}`);
  },

  verifyCode: async (data: VerificationRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const storedCode = verificationCodes.get(data.email);
    if (!storedCode || storedCode !== data.code) {
      throw new Error('인증 코드가 일치하지 않습니다.');
    }
    verificationCodes.delete(data.email);
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = getUsers();
    if (users.find((u) => u.email === data.email)) {
      throw new Error('이미 가입된 이메일입니다.');
    }

    const newUser: MockUser = {
      id: mockStorage.getNextId(),
      email: data.email,
      password: data.password,
      username: data.username,
      role: 'USER',
      teamIds: [],
    };

    users.push(newUser);
    mockStorage.set('users', users);

    return {
      uuid: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    };
  },

  requestPasswordResetCode: async (data: VerificationCodeRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const code = process.env.NEXT_PUBLIC_DEV_VERIFICATION_CODE || '123456';
    verificationCodes.set(data.email, code);
    console.log(`[Mock] 비밀번호 재설정 코드: ${code}`);
  },

  verifyPasswordResetCode: async (data: VerificationRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const storedCode = verificationCodes.get(data.email);
    if (!storedCode || storedCode !== data.code) {
      throw new Error('인증 코드가 일치하지 않습니다.');
    }
  },

  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].password = data.password;
      mockStorage.set('users', users);
    }
  },

  getProfile: async (): Promise<UserInfoResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
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
