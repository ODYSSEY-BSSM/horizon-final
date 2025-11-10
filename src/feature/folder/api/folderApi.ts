import { apiClient } from '@/shared/api';
import type {
  DirectoryCreateRequest,
  DirectoryResponse,
  DirectoryUpdateRequest,
  DirectoryContentResponse,
  TeamDirectoryCreateRequest,
  TeamDirectoryResponse,
  TeamDirectoryUpdateRequest,
  TeamDirectoryContentResponse,
} from '../types';

export const folderApi = {
  // ===================================
  // Personal Directory API
  // ===================================

  // 개인 디렉토리 생성
  createDirectory: async (data: DirectoryCreateRequest): Promise<DirectoryResponse> => {
    const response = await apiClient.post<DirectoryResponse>('/directories', data);
    return response.data;
  },

  // 개인 디렉토리 전체 조회
  getDirectories: async (): Promise<DirectoryResponse[]> => {
    const response = await apiClient.get<DirectoryResponse[]>('/directories');
    return response.data;
  },

  // 개인 디렉토리 단일 조회
  getDirectory: async (directoryUuid: number): Promise<DirectoryResponse> => {
    const response = await apiClient.get<DirectoryResponse>(`/directories/${directoryUuid}`);
    return response.data;
  },

  // 개인 디렉토리 수정
  updateDirectory: async (
    directoryUuid: number,
    data: DirectoryUpdateRequest,
  ): Promise<DirectoryResponse> => {
    const response = await apiClient.put<DirectoryResponse>(
      `/directories/${directoryUuid}`,
      data,
    );
    return response.data;
  },

  // 개인 디렉토리 삭제
  deleteDirectory: async (directoryUuid: number): Promise<void> => {
    await apiClient.delete(`/directories/${directoryUuid}`);
  },

  // 개인 디렉토리 컨텐츠 조회 (디렉토리 + 로드맵)
  getDirectoryContent: async (directoryUuid: number): Promise<DirectoryContentResponse> => {
    const response = await apiClient.get<DirectoryContentResponse>(
      `/directories/${directoryUuid}/content`,
    );
    return response.data;
  },

  // ===================================
  // Team Directory API
  // ===================================

  // 팀 디렉토리 생성
  createTeamDirectory: async (
    teamName: string,
    data: TeamDirectoryCreateRequest,
  ): Promise<TeamDirectoryResponse> => {
    const response = await apiClient.post<TeamDirectoryResponse>(
      `/directories/teams/${teamName}`,
      data,
    );
    return response.data;
  },

  // 팀 디렉토리 전체 조회
  getTeamDirectories: async (teamName: string): Promise<TeamDirectoryResponse[]> => {
    const response = await apiClient.get<TeamDirectoryResponse[]>(
      `/directories/teams/${teamName}`,
    );
    return response.data;
  },

  // 팀 디렉토리 단일 조회
  getTeamDirectory: async (teamName: string, directoryUuid: number): Promise<TeamDirectoryResponse> => {
    const response = await apiClient.get<TeamDirectoryResponse>(
      `/directories/teams/${teamName}/${directoryUuid}`,
    );
    return response.data;
  },

  // 팀 디렉토리 수정
  updateTeamDirectory: async (
    teamName: string,
    directoryUuid: number,
    data: TeamDirectoryUpdateRequest,
  ): Promise<TeamDirectoryResponse> => {
    const response = await apiClient.put<TeamDirectoryResponse>(
      `/directories/teams/${teamName}/${directoryUuid}`,
      data,
    );
    return response.data;
  },

  // 팀 디렉토리 삭제
  deleteTeamDirectory: async (teamName: string, directoryUuid: number): Promise<void> => {
    await apiClient.delete(`/directories/teams/${teamName}/${directoryUuid}`);
  },

  // 팀 디렉토리 컨텐츠 조회 (디렉토리 + 로드맵)
  getTeamDirectoryContent: async (
    teamName: string,
    directoryUuid: number,
  ): Promise<TeamDirectoryContentResponse> => {
    const response = await apiClient.get<TeamDirectoryContentResponse>(
      `/directories/teams/${teamName}/${directoryUuid}/content`,
    );
    return response.data;
  },
};
