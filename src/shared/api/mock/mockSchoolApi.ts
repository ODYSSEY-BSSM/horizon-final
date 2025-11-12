/**
 * Mock School API
 */

import { mockDatabase } from './mockDatabase';
import type {
  EducationNodeListResponse,
  SchoolDisconnectResponse,
  SchoolResponse,
} from '@/feature/school/types';
import type { EducationNodeResponse } from '@/shared/api/types';

export const mockSchoolApi = {
  // ===================================
  // School Connect API
  // ===================================

  // 학교 연동
  connectSchool: async (): Promise<SchoolResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    // 기본 학교 (BSSM)로 연동
    const school = mockDatabase.getSchools()[0];
    if (!school) {
      throw new Error('학교를 찾을 수 없습니다.');
    }

    // 사용자 정보 업데이트
    mockDatabase.updateUser(currentUser.uuid, {
      schoolUuid: school.uuid,
      isConnectedSchool: true,
    });

    return {
      uuid: school.uuid,
      name: school.name,
      code: school.code,
      logoUrl: school.logoUrl,
      connectedAt: new Date().toISOString(),
    };
  },

  // 학교 연동 정보 조회
  getConnectedSchool: async (): Promise<SchoolResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!currentUser.schoolUuid || !currentUser.isConnectedSchool) {
      throw new Error('학교에 연동되어 있지 않습니다.');
    }

    const school = mockDatabase.getSchool(currentUser.schoolUuid);
    if (!school) {
      throw new Error('학교를 찾을 수 없습니다.');
    }

    return {
      uuid: school.uuid,
      name: school.name,
      code: school.code,
      logoUrl: school.logoUrl,
      connectedAt: new Date().toISOString(),
    };
  },

  // 학교 연동 해제
  disconnectSchool: async (): Promise<SchoolDisconnectResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!currentUser.schoolUuid || !currentUser.isConnectedSchool) {
      throw new Error('학교에 연동되어 있지 않습니다.');
    }

    // 사용자 정보 업데이트
    mockDatabase.updateUser(currentUser.uuid, {
      schoolUuid: undefined,
      isConnectedSchool: false,
    });

    return {
      success: true,
      message: '학교 연동이 해제되었습니다.',
    };
  },

  // 교육과정 노드 목록 조회
  getEducationNodes: async (): Promise<EducationNodeListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!currentUser.schoolUuid || !currentUser.isConnectedSchool) {
      throw new Error('학교에 연동되어 있지 않습니다.');
    }

    const nodes = mockDatabase.getEducationNodes(currentUser.schoolUuid);

    const nodeResponses: EducationNodeResponse[] = nodes.map((node) => ({
      uuid: node.uuid,
      name: node.name,
      description: node.description,
      subject: node.subject,
      teacher: node.teacher,
      grade: node.grade,
      semester: node.semester,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
    }));

    return { nodes: nodeResponses };
  },

  // 특정 교육과정 노드 조회
  getEducationNode: async (educationId: number): Promise<EducationNodeListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!currentUser.schoolUuid || !currentUser.isConnectedSchool) {
      throw new Error('학교에 연동되어 있지 않습니다.');
    }

    const node = mockDatabase.getEducationNode(educationId);
    if (!node || node.schoolUuid !== currentUser.schoolUuid) {
      throw new Error('교육과정 노드를 찾을 수 없습니다.');
    }

    const nodeResponse: EducationNodeResponse = {
      uuid: node.uuid,
      name: node.name,
      description: node.description,
      subject: node.subject,
      teacher: node.teacher,
      grade: node.grade,
      semester: node.semester,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
    };

    return { nodes: [nodeResponse] };
  },
};
