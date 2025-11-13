/**
 * Real Roadmap API Implementation
 */

import { apiClient } from '@/shared/api/client';
import type {
  RoadmapCountResponse,
  RoadmapCreateRequest,
  RoadmapResponse,
  RoadmapUpdateRequest,
  TeamRoadmapCreateRequest,
  TeamRoadmapResponse,
} from '../types/roadmapApi';

export const realRoadmapApi = {
  // GET /roadmap - List personal roadmaps
  getRoadmaps: async (): Promise<RoadmapResponse[]> => {
    return apiClient.get<RoadmapResponse[]>('/roadmap');
  },

  // POST /roadmap - Create roadmap
  createRoadmap: async (data: RoadmapCreateRequest): Promise<RoadmapResponse> => {
    return apiClient.post<RoadmapResponse>('/roadmap', data);
  },

  // GET /roadmap/{id}
  getRoadmap: async (roadmapId: number): Promise<RoadmapResponse> => {
    return apiClient.get<RoadmapResponse>(`/roadmap/${roadmapId}`);
  },

  // PUT /roadmap/{id} - Update roadmap
  updateRoadmap: async (
    roadmapId: number,
    data: RoadmapUpdateRequest,
  ): Promise<RoadmapResponse> => {
    return apiClient.put<RoadmapResponse>(`/roadmap/${roadmapId}`, data);
  },

  // DELETE /roadmap/{id} - Delete roadmap
  deleteRoadmap: async (roadmapId: number): Promise<void> => {
    return apiClient.delete<void>(`/roadmap/${roadmapId}`);
  },

  // POST /roadmap/{id}/favorite - Toggle favorite status
  toggleFavorite: async (roadmapId: number): Promise<RoadmapResponse> => {
    return apiClient.post<RoadmapResponse>(`/roadmap/${roadmapId}/favorite`);
  },

  // GET /roadmap/last-accessed - Get most recent roadmap
  getLastAccessed: async (): Promise<RoadmapResponse> => {
    return apiClient.get<RoadmapResponse>('/roadmap/last-accessed');
  },

  // GET /roadmap/count - Get roadmap count
  getRoadmapCount: async (): Promise<RoadmapCountResponse> => {
    return apiClient.get<RoadmapCountResponse>('/roadmap/count');
  },

  // GET /teams/{teamId}/roadmap - List team roadmaps
  getTeamRoadmaps: async (teamId: number): Promise<TeamRoadmapResponse[]> => {
    return apiClient.get<TeamRoadmapResponse[]>(`/teams/${teamId}/roadmap`);
  },

  // POST /teams/{teamId}/roadmap - Create team roadmap
  createTeamRoadmap: async (
    teamId: number,
    data: TeamRoadmapCreateRequest,
  ): Promise<TeamRoadmapResponse> => {
    return apiClient.post<TeamRoadmapResponse>(`/teams/${teamId}/roadmap`, data);
  },
};
