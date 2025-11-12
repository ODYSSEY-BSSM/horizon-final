/**
 * Mock School API (Swagger 완벽 일치)
 */

import type {
  EducationNodeListResponse,
  EducationNodeResponse,
  SchoolConnectRequest,
  SchoolDisconnectResponse,
  SchoolResponse,
} from '@/feature/school/types';
import { delay, MOCK_DELAYS } from './mockConstants';
import type { MockSchool, MockUser } from './mockData';
import { initialMockData } from './mockData';
import { MOCK_ERRORS } from './mockErrors';
import { mockStorage } from './mockStorage';

function getSchools(): MockSchool[] {
  return mockStorage.getOrDefault('schools', initialMockData.schools);
}

function getUsers(): MockUser[] {
  return mockStorage.getOrDefault('users', initialMockData.users);
}

function getEducationNodes(): EducationNodeResponse[] {
  return mockStorage.getOrDefault('educationNodes', []);
}

export const mockSchoolApi = {
  connectSchool: async (data: SchoolConnectRequest): Promise<SchoolResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const schools = getSchools();
    const _users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }

    // 학교 코드로 학교 찾기
    const school = schools.find((s) => s.code === data.schoolCode);
    if (!school) {
      throw new Error(MOCK_ERRORS.INVALID_SCHOOL_CODE);
    }

    // 이미 연동된 학교가 있는지 확인
    if (currentUser.schoolId) {
      throw new Error(MOCK_ERRORS.SCHOOL_ALREADY_CONNECTED);
    }

    // 사용자에 학교 연동
    currentUser.schoolId = school.id;
    mockStorage.set('currentUser', currentUser);

    // 전체 사용자 목록 업데이트
    const allUsers = getUsers();
    const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = currentUser;
      mockStorage.set('users', allUsers);
    }

    return {
      id: school.id,
      name: school.name,
      code: school.code,
      logoUrl: school.logoUrl,
      connectedAt: new Date().toISOString(),
    };
  },

  getConnectedSchool: async (): Promise<SchoolResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const schools = getSchools();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }
    if (!currentUser.schoolId) {
      throw new Error(MOCK_ERRORS.NO_SCHOOL_CONNECTED);
    }

    const school = schools.find((s) => s.id === currentUser.schoolId);
    if (!school) {
      throw new Error(MOCK_ERRORS.SCHOOL_NOT_FOUND);
    }

    return {
      id: school.id,
      name: school.name,
      code: school.code,
      logoUrl: school.logoUrl,
      connectedAt: new Date().toISOString(),
    };
  },

  disconnectSchool: async (): Promise<SchoolDisconnectResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const _users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }
    if (!currentUser.schoolId) {
      throw new Error(MOCK_ERRORS.NO_SCHOOL_CONNECTED);
    }

    // 사용자의 학교 연동 해제
    currentUser.schoolId = undefined;
    mockStorage.set('currentUser', currentUser);

    // 전체 사용자 목록 업데이트
    const allUsers = getUsers();
    const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = currentUser;
      mockStorage.set('users', allUsers);
    }

    return {
      success: true,
      message: '학교 연동이 해제되었습니다.',
    };
  },

  getEducationNodes: async (): Promise<EducationNodeListResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }
    if (!currentUser.schoolId) {
      throw new Error(MOCK_ERRORS.SCHOOL_CONNECTION_REQUIRED);
    }

    const educationNodes = getEducationNodes();

    // 현재 사용자의 학교에 해당하는 교육과정 노드만 반환
    const schoolNodes = educationNodes.filter(
      (node: any) => node.schoolId === currentUser.schoolId,
    );

    return { nodes: schoolNodes };
  },

  getEducationNode: async (nodeId: number): Promise<EducationNodeResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }
    if (!currentUser.schoolId) {
      throw new Error(MOCK_ERRORS.SCHOOL_CONNECTION_REQUIRED);
    }

    const educationNodes = getEducationNodes();
    const node = educationNodes.find(
      (n: any) => n.id === nodeId && n.schoolId === currentUser.schoolId,
    );

    if (!node) {
      throw new Error(MOCK_ERRORS.EDUCATION_NODE_NOT_FOUND);
    }

    return node;
  },
};
