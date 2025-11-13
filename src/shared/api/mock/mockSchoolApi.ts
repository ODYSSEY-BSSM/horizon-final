
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

    const school = schools.find((s) => s.code === data.schoolCode);
    if (!school) {
      throw new Error(MOCK_ERRORS.INVALID_SCHOOL_CODE);
    }

    if (currentUser.schoolId) {
      throw new Error(MOCK_ERRORS.SCHOOL_ALREADY_CONNECTED);
    }

    currentUser.schoolId = school.id;
    mockStorage.set('currentUser', currentUser);

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

    currentUser.schoolId = undefined;
    mockStorage.set('currentUser', currentUser);

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
