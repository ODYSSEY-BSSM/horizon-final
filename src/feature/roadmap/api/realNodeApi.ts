
import { apiClient } from '@/shared/api/client';
import type {
  EducationNodeConvertRequest,
  NodeCreateRequest,
  NodeListResponse,
  NodeResponse,
  NodeUpdateRequest,
} from '../types/node';

export const realNodeApi = {
  getNodes: async (roadmapId: number): Promise<NodeListResponse> => {
    return apiClient.get<NodeListResponse>(`/roadmap/${roadmapId}/nodes`);
  },

  createNode: async (roadmapId: number, data: NodeCreateRequest): Promise<NodeResponse> => {
    return apiClient.post<NodeResponse>(`/roadmap/${roadmapId}/nodes`, data);
  },

  getNode: async (roadmapId: number, nodeId: number): Promise<NodeResponse> => {
    return apiClient.get<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },

  updateNode: async (
    roadmapId: number,
    nodeId: number,
    data: NodeUpdateRequest,
  ): Promise<NodeResponse> => {
    return apiClient.put<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`, data);
  },

  deleteNode: async (roadmapId: number, nodeId: number): Promise<void> => {
    return apiClient.delete<void>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },

  convertEducationNode: async (
    roadmapId: number,
    nodeId: number,
    data: EducationNodeConvertRequest,
  ): Promise<NodeResponse> => {
    return apiClient.patch<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`, data);
  },
};
