
import { apiClient } from '@/shared/api/client';
import type {
  DirectoryContentResponse,
  DirectoryCreateRequest,
  DirectoryResponse,
  DirectoryUpdateRequest,
  TeamDirectoryCreateRequest,
  TeamDirectoryResponse,
  TeamDirectoryUpdateRequest,
} from '../types/directory';

export const realFolderApi = {
  getRoot: async (): Promise<DirectoryContentResponse> => {
    return apiClient.get<DirectoryContentResponse>('/root');
  },

  getTeamRoot: async (teamId: number): Promise<DirectoryContentResponse> => {
    return apiClient.get<DirectoryContentResponse>('/root/team', {
      params: { teamId },
    });
  },

  createDirectory: async (data: DirectoryCreateRequest): Promise<DirectoryResponse> => {
    return apiClient.post<DirectoryResponse>('/directories', data);
  },

  updateDirectory: async (
    directoryId: number,
    data: DirectoryUpdateRequest,
  ): Promise<DirectoryResponse> => {
    return apiClient.put<DirectoryResponse>(`/directories/${directoryId}`, data);
  },

  deleteDirectory: async (directoryId: number): Promise<void> => {
    return apiClient.delete<void>(`/directories/${directoryId}`);
  },

  createTeamDirectory: async (
    teamId: number,
    data: TeamDirectoryCreateRequest,
  ): Promise<TeamDirectoryResponse> => {
    return apiClient.post<TeamDirectoryResponse>(`/directories/team/${teamId}`, data);
  },

  updateTeamDirectory: async (
    directoryId: number,
    teamId: number,
    data: TeamDirectoryUpdateRequest,
  ): Promise<TeamDirectoryResponse> => {
    return apiClient.put<TeamDirectoryResponse>(`/directories/${directoryId}/team/${teamId}`, data);
  },

  deleteTeamDirectory: async (directoryId: number, teamId: number): Promise<void> => {
    return apiClient.delete<void>(`/directories/${directoryId}/team/${teamId}`);
  },
};
