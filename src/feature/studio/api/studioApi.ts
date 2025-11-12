import { apiClient } from '@/shared/api';
import type { ApiResponse } from '@/shared/api/types';
import type { CreateNodeRequest, StudioNodeData, UpdateNodeRequest } from '../types/node';

/**
 * Studio API 클라이언트
 * 백엔드 API 명세서의 Node API를 호출합니다
 */
export const studioApi = {
  /**
   * 로드맵의 모든 노드 조회
   * GET /roadmap/:id/nodes
   */
  async getNodes(roadmapId: number): Promise<ApiResponse<StudioNodeData[]>> {
    return apiClient.get<StudioNodeData[]>(`/roadmap/${roadmapId}/nodes`);
  },

  /**
   * 단일 노드 조회
   * GET /roadmap/:roadmapId/nodes/:nodeId
   */
  async getNode(roadmapId: number, nodeId: number): Promise<ApiResponse<StudioNodeData>> {
    return apiClient.get<StudioNodeData>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },

  /**
   * 노드 생성
   * POST /roadmap/:id/nodes
   */
  async createNode(
    roadmapId: number,
    data: CreateNodeRequest,
  ): Promise<ApiResponse<StudioNodeData>> {
    return apiClient.post<StudioNodeData>(`/roadmap/${roadmapId}/nodes`, data);
  },

  /**
   * 노드 수정
   * PUT /roadmap/:roadmapId/nodes/:nodeId
   */
  async updateNode(
    roadmapId: number,
    nodeId: number,
    data: UpdateNodeRequest,
  ): Promise<ApiResponse<StudioNodeData>> {
    return apiClient.put<StudioNodeData>(`/roadmap/${roadmapId}/nodes/${nodeId}`, data);
  },

  /**
   * 노드 삭제
   * DELETE /roadmap/:roadmapId/nodes/:nodeId
   */
  async deleteNode(roadmapId: number, nodeId: number): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },

  /**
   * 교육과정 노드로 전환
   * PATCH /roadmap/:roadmapId/nodes/:nodeId
   */
  async convertToEducationNode(
    roadmapId: number,
    nodeId: number,
    subject: string,
  ): Promise<ApiResponse<StudioNodeData>> {
    return apiClient.put<StudioNodeData>(`/roadmap/${roadmapId}/nodes/${nodeId}`, {
      subject,
    });
  },
};
