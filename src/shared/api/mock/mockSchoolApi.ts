/**
 * Mock School API (Swagger 완벽 일치)
 */

import { mockStorage } from './mockStorage';
import { initialMockData } from './mockData';
import type {
  SchoolConnectRequest,
  SchoolResponse,
  EducationNodeResponse,
  EducationNodeListResponse,
  SchoolDisconnectResponse,
} from '@/feature/school/types';
import type { MockUser, MockSchool } from './mockData';

function getSchools(): MockSchool[] {
  return mockStorage.get<MockSchool[]>('schools') || initialMockData.schools;
}

function getUsers(): MockUser[] {
  return mockStorage.get<MockUser[]>('users') || initialMockData.users;
}

function getEducationNodes(): EducationNodeResponse[] {
  return mockStorage.get<EducationNodeResponse[]>('educationNodes') || [];
}

export const mockSchoolApi = {
  connectSchool: async (data: SchoolConnectRequest): Promise<SchoolResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const schools = getSchools();
    const users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) throw new Error('로그인이 필요합니다.');

    // 학교 코드로 학교 찾기
    const school = schools.find((s) => s.code === data.schoolCode);
    if (!school) throw new Error('유효하지 않은 학교 코드입니다.');

    // 이미 연동된 학교가 있는지 확인
    if (currentUser.schoolId) {
      throw new Error('이미 학교가 연동되어 있습니다.');
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
    await new Promise((resolve) => setTimeout(resolve, 100));

    const schools = getSchools();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) throw new Error('로그인이 필요합니다.');
    if (!currentUser.schoolId) throw new Error('연동된 학교가 없습니다.');

    const school = schools.find((s) => s.id === currentUser.schoolId);
    if (!school) throw new Error('학교를 찾을 수 없습니다.');

    return {
      id: school.id,
      name: school.name,
      code: school.code,
      logoUrl: school.logoUrl,
      connectedAt: new Date().toISOString(),
    };
  },

  disconnectSchool: async (): Promise<SchoolDisconnectResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) throw new Error('로그인이 필요합니다.');
    if (!currentUser.schoolId) throw new Error('연동된 학교가 없습니다.');

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
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) throw new Error('로그인이 필요합니다.');
    if (!currentUser.schoolId) throw new Error('학교 연동이 필요합니다.');

    const educationNodes = getEducationNodes();

    // 현재 사용자의 학교에 해당하는 교육과정 노드만 반환
    const schoolNodes = educationNodes.filter((node: any) => node.schoolId === currentUser.schoolId);

    return { nodes: schoolNodes };
  },

  getEducationNode: async (nodeId: number): Promise<EducationNodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) throw new Error('로그인이 필요합니다.');
    if (!currentUser.schoolId) throw new Error('학교 연동이 필요합니다.');

    const educationNodes = getEducationNodes();
    const node = educationNodes.find((n: any) => n.id === nodeId && n.schoolId === currentUser.schoolId);

    if (!node) throw new Error('교육과정 노드를 찾을 수 없습니다.');

    return node;
  },
};
