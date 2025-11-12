/**
 * Mock Auth API
 */

import { mockDatabase } from './mockDatabase';
import { mockStorage } from './mockStorage';
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

// 가짜 JWT 토큰 생성
const generateFakeToken = (userUuid: number, type: 'access' | 'refresh'): string => {
  const payload = {
    sub: userUuid.toString(),
    type,
    iat: Date.now(),
    exp: Date.now() + (type === 'access' ? 3600000 : 86400000), // 1시간 / 24시간
  };
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
};

// 임시 인증 코드 저장소
const verificationCodes = new Map<string, string>();

export const mockAuthApi = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // 네트워크 지연 시뮬레이션

    const user = mockDatabase.getUserByEmail(credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 현재 사용자로 설정
    mockDatabase.setCurrentUser(user);

    const accessToken = generateFakeToken(user.uuid, 'access');
    const refreshToken = generateFakeToken(user.uuid, 'refresh');

    return {
      accessToken,
      refreshToken,
    };
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // 토큰에서 사용자 정보 추출 (간단한 검증)
      const payload = JSON.parse(atob(refreshToken.split('.')[1]));
      const user = mockDatabase.getUser(Number.parseInt(payload.sub));

      if (!user) {
        throw new Error('유효하지 않은 토큰입니다.');
      }

      const newAccessToken = generateFakeToken(user.uuid, 'access');
      const newRefreshToken = generateFakeToken(user.uuid, 'refresh');

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new Error('토큰 갱신에 실패했습니다.');
    }
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    mockDatabase.setCurrentUser(null);
  },

  // 회원가입 인증 코드 요청
  requestVerificationCode: async (data: VerificationCodeRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 이미 가입된 이메일 체크
    const existingUser = mockDatabase.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('이미 가입된 이메일입니다.');
    }

    // 개발 환경에서는 고정 코드 사용
    const code = process.env.NEXT_PUBLIC_DEV_VERIFICATION_CODE || '123456';
    verificationCodes.set(data.email, code);

    console.log(`[Mock] 인증 코드 발송: ${data.email} -> ${code}`);
  },

  // 회원가입 인증 코드 인증
  verifyCode: async (data: VerificationRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const storedCode = verificationCodes.get(data.email);
    if (!storedCode || storedCode !== data.code) {
      throw new Error('인증 코드가 일치하지 않습니다.');
    }

    // 인증 성공 후 코드 제거
    verificationCodes.delete(data.email);
    console.log(`[Mock] 인증 성공: ${data.email}`);
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 이메일 중복 체크
    const existingUser = mockDatabase.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('이미 가입된 이메일입니다.');
    }

    const uuid = mockStorage.getNextId('User');
    const newUser = {
      uuid,
      email: data.email,
      password: data.password,
      username: data.username,
      role: 'USER' as const,
      teams: [],
      createdAt: new Date().toISOString(),
    };

    mockDatabase.addUser(newUser);

    return {
      uuid: newUser.uuid,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    };
  },

  // 비밀번호 변경 인증 코드 발송
  requestPasswordResetCode: async (data: VerificationCodeRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = mockDatabase.getUserByEmail(data.email);
    if (!user) {
      throw new Error('등록되지 않은 이메일입니다.');
    }

    const code = process.env.NEXT_PUBLIC_DEV_VERIFICATION_CODE || '123456';
    verificationCodes.set(data.email, code);

    console.log(`[Mock] 비밀번호 재설정 코드 발송: ${data.email} -> ${code}`);
  },

  // 비밀번호 변경 인증 코드 인증
  verifyPasswordResetCode: async (data: VerificationRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const storedCode = verificationCodes.get(data.email);
    if (!storedCode || storedCode !== data.code) {
      throw new Error('인증 코드가 일치하지 않습니다.');
    }

    verificationCodes.delete(data.email);
    console.log(`[Mock] 비밀번호 재설정 인증 성공: ${data.email}`);
  },

  // 유저 비밀번호 변경
  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    mockDatabase.updateUser(currentUser.uuid, {
      password: data.password,
    });

    console.log(`[Mock] 비밀번호 변경 완료: ${currentUser.email}`);
  },

  // 사용자 정보 조회
  getProfile: async (): Promise<UserInfoResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    // 팀 이름 목록 가져오기
    const teams = currentUser.teams
      .map((teamId) => mockDatabase.getTeam(teamId))
      .filter((team) => team !== undefined)
      .map((team) => team!.name);

    // 학교 정보
    let school: string | undefined;
    if (currentUser.schoolUuid) {
      const schoolData = mockDatabase.getSchool(currentUser.schoolUuid);
      school = schoolData?.name;
    }

    return {
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
      teams,
      school,
      isConnectedSchool: currentUser.isConnectedSchool,
    };
  },
};
