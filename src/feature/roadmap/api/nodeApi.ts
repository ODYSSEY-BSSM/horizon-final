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
  createNode: async (roadmapId: number, data: NodeCreateRequest): Promise<NodeResponse> => {
    const response = await apiClient.post<NodeResponse>(`/roadmap/${roadmapId}/nodes`, data);
    return response.data;
  },

  // 교육과정 노드 전환
  convertEducationNode: async (
    roadmapId: number,
    nodeId: number,
    data: EducationNodeConvertRequest,
  ): Promise<NodeResponse> => {
    const response = await apiClient.patch<NodeResponse>(
      `/roadmap/${roadmapId}/nodes/${nodeId}`,
      data,
    );
    return response.data;
  },

  // 단일 노드 조회
  getNode: async (roadmapId: number, nodeId: number): Promise<NodeResponse> => {
    const response = await apiClient.get<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
    return response.data;
  },

  // 노드 전체 조회
  getNodes: async (roadmapId: number): Promise<NodeListResponse> => {
    const response = await apiClient.get<NodeListResponse>(`/roadmap/${roadmapId}/nodes`);
    return response.data;
  },

  // 노드 수정
  updateNode: async (
    roadmapId: number,
    nodeId: number,
    data: NodeUpdateRequest,
  ): Promise<NodeResponse> => {
    const response = await apiClient.put<NodeResponse>(
      `/roadmap/${roadmapId}/nodes/${nodeId}`,
      data,
    );
    return response.data;
  },

  // 노드 삭제
  deleteNode: async (roadmapId: number, nodeId: number): Promise<void> => {
    await apiClient.delete(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },
};
