/**
 * Real Node API Implementation
 */

import { apiClient } from '@/shared/api/client';
import type {
  EducationNodeConvertRequest,
  NodeCreateRequest,
  NodeListResponse,
  NodeResponse,
  NodeUpdateRequest,
} from '../types/node';

export const realNodeApi = {
  // GET /roadmap/{roadmapId}/nodes - List nodes in roadmap
  getNodes: async (roadmapId: number): Promise<NodeListResponse> => {
    return apiClient.get<NodeListResponse>(`/roadmap/${roadmapId}/nodes`);
  },

  // POST /roadmap/{roadmapId}/nodes - Create node
  createNode: async (roadmapId: number, data: NodeCreateRequest): Promise<NodeResponse> => {
    return apiClient.post<NodeResponse>(`/roadmap/${roadmapId}/nodes`, data);
  },

  // GET /roadmap/{roadmapId}/nodes/{nodeId} - Get specific node
  getNode: async (roadmapId: number, nodeId: number): Promise<NodeResponse> => {
    return apiClient.get<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },

  // PUT /roadmap/{roadmapId}/nodes/{nodeId} - Update node
  updateNode: async (
    roadmapId: number,
    nodeId: number,
    data: NodeUpdateRequest,
  ): Promise<NodeResponse> => {
    return apiClient.put<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`, data);
  },

  // DELETE /roadmap/{roadmapId}/nodes/{nodeId} - Delete node
  deleteNode: async (roadmapId: number, nodeId: number): Promise<void> => {
    return apiClient.delete<void>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },

  // PATCH /roadmap/{roadmapId}/nodes/{nodeId} - Update education subject
  convertEducationNode: async (
    roadmapId: number,
    nodeId: number,
    data: EducationNodeConvertRequest,
  ): Promise<NodeResponse> => {
    return apiClient.patch<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`, data);
  },
};
