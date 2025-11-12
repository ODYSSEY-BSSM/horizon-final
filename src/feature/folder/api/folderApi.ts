import { apiClient } from '@/shared/api';
import type {
  DirectoryContentResponse,
  DirectoryCreateRequest,
  DirectoryResponse,
  DirectoryUpdateRequest,
  TeamDirectoryCreateRequest,
  TeamDirectoryResponse,
  TeamDirectoryUpdateRequest,
} from '../types';

export const folderApi = {
  // ===================================
  // Personal Directory API
  // ===================================

  // 루트 디렉토리 조회
  getRootDirectory: async (): Promise<DirectoryContentResponse> => {
    const response = await apiClient.get<DirectoryContentResponse>('/root');
    return response.data;
  },

  // 팀 루트 디렉토리 조회
  getTeamRootDirectory: async (teamId: number): Promise<DirectoryContentResponse> => {
    const response = await apiClient.get<DirectoryContentResponse>(`/root/team?teamId=${teamId}`);
    return response.data;
  },

  // 개인 디렉토리 생성
  createDirectory: async (data: DirectoryCreateRequest): Promise<DirectoryResponse> => {
    const response = await apiClient.post<DirectoryResponse>('/directories', data);
    return response.data;
  },

  // 개인 디렉토리 수정
  updateDirectory: async (
    directoryId: number,
    data: DirectoryUpdateRequest,
  ): Promise<DirectoryResponse> => {
    const response = await apiClient.put<DirectoryResponse>(`/directories/${directoryId}`, data);
    return response.data;
  },

  // 개인 디렉토리 삭제
  deleteDirectory: async (directoryId: number): Promise<void> => {
    await apiClient.delete(`/directories/${directoryId}`);
  },

  // ===================================
  // Team Directory API
  // ===================================

  // 팀 디렉토리 생성
  createTeamDirectory: async (
    teamId: number,
    data: TeamDirectoryCreateRequest,
  ): Promise<TeamDirectoryResponse> => {
    const response = await apiClient.post<TeamDirectoryResponse>(
      `/directories/team/${teamId}`,
      data,
    );
    return response.data;
  },

  // 팀 디렉토리 수정
  updateTeamDirectory: async (
    directoryId: number,
    teamId: number,
    data: TeamDirectoryUpdateRequest,
  ): Promise<TeamDirectoryResponse> => {
    const response = await apiClient.put<TeamDirectoryResponse>(
      `/directories/${directoryId}/team/${teamId}`,
      data,
    );
    return response.data;
  },

  // 팀 디렉토리 삭제
  deleteTeamDirectory: async (directoryId: number, teamId: number): Promise<void> => {
    await apiClient.delete(`/directories/${directoryId}/team/${teamId}`);
  },
};
