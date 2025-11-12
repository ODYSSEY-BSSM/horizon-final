import { apiClient } from '@/shared/api';
import type {
  EducationNodeListResponse,
  SchoolConnectRequest,
  SchoolDisconnectResponse,
  SchoolResponse,
} from '../types';

export const schoolApi = {
  // ===================================
  // School Connect API
  // ===================================

  // 학교 연동
  connectSchool: async (): Promise<SchoolResponse> => {
    const response = await apiClient.put<SchoolResponse>('/users/school');
    return response.data;
  },

  // 학교 연동 정보 조회
  getConnectedSchool: async (): Promise<SchoolResponse> => {
    const response = await apiClient.get<SchoolResponse>('/users/school');
    return response.data;
  },

  // 학교 연동 해제
  disconnectSchool: async (): Promise<SchoolDisconnectResponse> => {
    const response = await apiClient.delete<SchoolDisconnectResponse>('/users/school');
    return response.data;
  },

  // 교육과정 노드 목록 조회
  getEducationNodes: async (): Promise<EducationNodeListResponse> => {
    const response = await apiClient.get<EducationNodeListResponse>('/education-nodes');
    return response.data;
  },

  // 특정 교육과정 노드 조회
  getEducationNode: async (educationId: number): Promise<EducationNodeListResponse> => {
    const response = await apiClient.get<EducationNodeListResponse>(
      `/education-nodes/${educationId}`,
    );
    return response.data;
  },
};
