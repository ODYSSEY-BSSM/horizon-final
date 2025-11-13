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
  getRoadmaps: async (): Promise<RoadmapResponse[]> => {
    return apiClient.get<RoadmapResponse[]>('/roadmap');
  },

  createRoadmap: async (data: RoadmapCreateRequest): Promise<RoadmapResponse> => {
    return apiClient.post<RoadmapResponse>('/roadmap', data);
  },

  getRoadmap: async (roadmapId: number): Promise<RoadmapResponse> => {
    return apiClient.get<RoadmapResponse>(`/roadmap/${roadmapId}`);
  },

  updateRoadmap: async (
    roadmapId: number,
    data: RoadmapUpdateRequest,
  ): Promise<RoadmapResponse> => {
    return apiClient.put<RoadmapResponse>(`/roadmap/${roadmapId}`, data);
  },

  deleteRoadmap: async (roadmapId: number): Promise<void> => {
    return apiClient.delete<void>(`/roadmap/${roadmapId}`);
  },

  toggleFavorite: async (roadmapId: number): Promise<RoadmapResponse> => {
    return apiClient.post<RoadmapResponse>(`/roadmap/${roadmapId}/favorite`);
  },

  getLastAccessed: async (): Promise<RoadmapResponse> => {
    return apiClient.get<RoadmapResponse>('/roadmap/last-accessed');
  },

  getRoadmapCount: async (): Promise<RoadmapCountResponse> => {
    return apiClient.get<RoadmapCountResponse>('/roadmap/count');
  },

  getTeamRoadmaps: async (teamId: number): Promise<TeamRoadmapResponse[]> => {
    return apiClient.get<TeamRoadmapResponse[]>(`/teams/${teamId}/roadmap`);
  },

  createTeamRoadmap: async (
    teamId: number,
    data: TeamRoadmapCreateRequest,
  ): Promise<TeamRoadmapResponse> => {
    return apiClient.post<TeamRoadmapResponse>(`/teams/${teamId}/roadmap`, data);
  },
};
