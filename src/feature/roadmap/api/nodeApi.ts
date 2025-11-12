import { apiClient } from '@/shared/api';
import type {
  EducationNodeConvertRequest,
  NodeCreateRequest,
  NodeListResponse,
  NodeResponse,
  NodeUpdateRequest,
} from '../types';

export const nodeApi = {
  // ===================================
  // Node API
  // ===================================

  // 노드 생성
  createNode: async (roadmapUuid: number, data: NodeCreateRequest): Promise<NodeResponse> => {
    const response = await apiClient.post<NodeResponse>(`/nodes/roadmaps/${roadmapUuid}`, data);
    return response.data;
  },

  // 교육과정 노드 전환
  convertEducationNode: async (
    educationUuid: number,
    roadmapUuid: number,
    data: EducationNodeConvertRequest,
  ): Promise<NodeResponse> => {
    const response = await apiClient.post<NodeResponse>(
      `/nodes/education/${educationUuid}/roadmaps/${roadmapUuid}`,
      data,
    );
    return response.data;
  },

  // 단일 노드 조회
  getNode: async (nodeUuid: number): Promise<NodeResponse> => {
    const response = await apiClient.get<NodeResponse>(`/nodes/${nodeUuid}`);
    return response.data;
  },

  // 노드 전체 조회
  getNodes: async (roadmapUuid: number): Promise<NodeListResponse> => {
    const response = await apiClient.get<NodeListResponse>(`/nodes/roadmaps/${roadmapUuid}`);
    return response.data;
  },

  // 노드 수정
  updateNode: async (nodeUuid: number, data: NodeUpdateRequest): Promise<NodeResponse> => {
    const response = await apiClient.put<NodeResponse>(`/nodes/${nodeUuid}`, data);
    return response.data;
  },

  // 노드 삭제
  deleteNode: async (nodeUuid: number): Promise<void> => {
    await apiClient.delete(`/nodes/${nodeUuid}`);
  },
};
