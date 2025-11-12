import { apiClient } from '@/shared/api';
import type {
  RoadmapCountResponse,
  RoadmapCreateRequest,
  RoadmapResponse,
  RoadmapUpdateRequest,
  TeamRoadmapCreateRequest,
  TeamRoadmapResponse,
  TeamRoadmapUpdateRequest,
} from '../types';

export const roadmapApi = {
  // ===================================
  // Personal Roadmap API
  // ===================================

  // 개인 로드맵 생성
  createRoadmap: async (data: RoadmapCreateRequest): Promise<RoadmapResponse> => {
    const response = await apiClient.post<RoadmapResponse>('/roadmaps', data);
    return response.data;
  },

  // 개인 로드맵 전체 조회
  getRoadmaps: async (): Promise<RoadmapResponse[]> => {
    const response = await apiClient.get<RoadmapResponse[]>('/roadmaps');
    return response.data;
  },

  // 개인 로드맵 단일 조회
  getRoadmap: async (roadmapUuid: number): Promise<RoadmapResponse> => {
    const response = await apiClient.get<RoadmapResponse>(`/roadmaps/${roadmapUuid}`);
    return response.data;
  },

  // 개인 로드맵 수정
  updateRoadmap: async (
    roadmapUuid: number,
    data: RoadmapUpdateRequest,
  ): Promise<RoadmapResponse> => {
    const response = await apiClient.put<RoadmapResponse>(`/roadmaps/${roadmapUuid}`, data);
    return response.data;
  },

  // 개인 로드맵 삭제
  deleteRoadmap: async (roadmapUuid: number): Promise<void> => {
    await apiClient.delete(`/roadmaps/${roadmapUuid}`);
  },

  // 즐겨찾기 추가
  addFavorite: async (roadmapUuid: number): Promise<void> => {
    await apiClient.post(`/roadmaps/${roadmapUuid}/favorite`);
  },

  // 즐겨찾기 삭제
  removeFavorite: async (roadmapUuid: number): Promise<void> => {
    await apiClient.delete(`/roadmaps/${roadmapUuid}/favorite`);
  },

  // 마지막 접속 시간 갱신
  updateLastAccessed: async (roadmapUuid: number): Promise<void> => {
    await apiClient.put(`/roadmaps/${roadmapUuid}/last-accessed`);
  },

  // 개인 로드맵 개수 조회
  getRoadmapCount: async (): Promise<RoadmapCountResponse> => {
    const response = await apiClient.get<RoadmapCountResponse>('/roadmaps/count');
    return response.data;
  },

  // ===================================
  // Team Roadmap API
  // ===================================

  // 팀 로드맵 생성
  createTeamRoadmap: async (
    teamName: string,
    data: TeamRoadmapCreateRequest,
  ): Promise<TeamRoadmapResponse> => {
    const response = await apiClient.post<TeamRoadmapResponse>(`/roadmaps/teams/${teamName}`, data);
    return response.data;
  },

  // 팀 로드맵 전체 조회
  getTeamRoadmaps: async (teamName: string): Promise<TeamRoadmapResponse[]> => {
    const response = await apiClient.get<TeamRoadmapResponse[]>(`/roadmaps/teams/${teamName}`);
    return response.data;
  },

  // 팀 로드맵 단일 조회
  getTeamRoadmap: async (teamName: string, roadmapUuid: number): Promise<TeamRoadmapResponse> => {
    const response = await apiClient.get<TeamRoadmapResponse>(
      `/roadmaps/teams/${teamName}/${roadmapUuid}`,
    );
    return response.data;
  },

  // 팀 로드맵 수정
  updateTeamRoadmap: async (
    teamName: string,
    roadmapUuid: number,
    data: TeamRoadmapUpdateRequest,
  ): Promise<TeamRoadmapResponse> => {
    const response = await apiClient.put<TeamRoadmapResponse>(
      `/roadmaps/teams/${teamName}/${roadmapUuid}`,
      data,
    );
    return response.data;
  },

  // 팀 로드맵 삭제
  deleteTeamRoadmap: async (teamName: string, roadmapUuid: number): Promise<void> => {
    await apiClient.delete(`/roadmaps/teams/${teamName}/${roadmapUuid}`);
  },

  // 팀 로드맵 개수 조회
  getTeamRoadmapCount: async (teamName: string): Promise<RoadmapCountResponse> => {
    const response = await apiClient.get<RoadmapCountResponse>(`/roadmaps/teams/${teamName}/count`);
    return response.data;
  },
};
