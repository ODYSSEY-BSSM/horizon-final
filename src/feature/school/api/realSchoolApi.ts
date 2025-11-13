import { apiClient } from '@/shared/api/client';
import type {
  EducationNodeListResponse,
  EducationNodeResponse,
  SchoolConnectRequest,
  SchoolDisconnectResponse,
  SchoolResponse,
} from '../types';

export const realSchoolApi = {
  connectSchool: async (data: SchoolConnectRequest): Promise<SchoolResponse> => {
    return apiClient.post<SchoolResponse>('/schools/connect', data);
  },

  getConnectedSchool: async (): Promise<SchoolResponse> => {
    return apiClient.get<SchoolResponse>('/schools/connected');
  },

  disconnectSchool: async (): Promise<SchoolDisconnectResponse> => {
    return apiClient.delete<SchoolDisconnectResponse>('/schools/connected');
  },

  getEducationNodes: async (): Promise<EducationNodeListResponse> => {
    return apiClient.get<EducationNodeListResponse>('/schools/education-nodes');
  },

  getEducationNode: async (nodeId: number): Promise<EducationNodeResponse> => {
    return apiClient.get<EducationNodeResponse>(`/schools/education-nodes/${nodeId}`);
  },
};
