import { apiClient } from '@/shared/api';
import type {
  RoadmapCountResponse,
  RoadmapCreateRequest,
  RoadmapResponse,
  RoadmapUpdateRequest,
  TeamRoadmapCreateRequest,
  TeamRoadmapResponse,
} from '../types';

export const roadmapApi = {
  // ===================================
  // Personal Roadmap API
  // ===================================

  // 개인 로드맵 생성
  createRoadmap: async (data: RoadmapCreateRequest): Promise<RoadmapResponse> => {
    const response = await apiClient.post<RoadmapResponse>('/roadmap', data);
    return response.data;
  },

  // 개인 로드맵 전체 조회
  getRoadmaps: async (): Promise<RoadmapResponse[]> => {
    const response = await apiClient.get<RoadmapResponse[]>('/roadmap');
    return response.data;
  },

  // 개인 로드맵 단일 조회
  getRoadmap: async (roadmapId: number): Promise<RoadmapResponse> => {
    const response = await apiClient.get<RoadmapResponse>(`/roadmap/${roadmapId}`);
    return response.data;
  },

  // 개인 로드맵 수정
  updateRoadmap: async (
    roadmapId: number,
    data: RoadmapUpdateRequest,
  ): Promise<RoadmapResponse> => {
    const response = await apiClient.put<RoadmapResponse>(`/roadmap/${roadmapId}`, data);
    return response.data;
  },

  // 개인 로드맵 삭제
  deleteRoadmap: async (roadmapId: number): Promise<void> => {
    await apiClient.delete(`/roadmap/${roadmapId}`);
  },

  // 즐겨찾기 토글
  toggleFavorite: async (roadmapId: number): Promise<void> => {
    await apiClient.post(`/roadmap/${roadmapId}/favorite`);
  },

  // 마지막 접속 조회
  getLastAccessed: async (): Promise<RoadmapResponse> => {
    const response = await apiClient.get<RoadmapResponse>('/roadmap/last-accessed');
    return response.data;
  },

  // 개인 로드맵 개수 조회
  getRoadmapCount: async (): Promise<RoadmapCountResponse> => {
    const response = await apiClient.get<RoadmapCountResponse>('/roadmap/count');
    return response.data;
  },

  // ===================================
  // Team Roadmap API
  // ===================================

  // 팀 로드맵 생성
  createTeamRoadmap: async (
    teamId: number,
    data: TeamRoadmapCreateRequest,
  ): Promise<TeamRoadmapResponse> => {
    const response = await apiClient.post<TeamRoadmapResponse>(`/teams/${teamId}/roadmap`, data);
    return response.data;
  },

  // 팀 로드맵 전체 조회
  getTeamRoadmaps: async (teamId: number): Promise<TeamRoadmapResponse[]> => {
    const response = await apiClient.get<TeamRoadmapResponse[]>(`/teams/${teamId}/roadmap`);
    return response.data;
  },
};
