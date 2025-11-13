/**
 * Real Directory/Folder API Implementation
 */

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
  // GET /root - Retrieve personal directories
  getRoot: async (): Promise<DirectoryContentResponse> => {
    return apiClient.get<DirectoryContentResponse>('/root');
  },

  // GET /root/team - Retrieve team directories
  getTeamRoot: async (teamId: number): Promise<DirectoryContentResponse> => {
    return apiClient.get<DirectoryContentResponse>('/root/team', {
      params: { teamId },
    });
  },

  // POST /directories - Create directory
  createDirectory: async (data: DirectoryCreateRequest): Promise<DirectoryResponse> => {
    return apiClient.post<DirectoryResponse>('/directories', data);
  },

  // PUT /directories/{directoryId} - Update directory
  updateDirectory: async (
    directoryId: number,
    data: DirectoryUpdateRequest,
  ): Promise<DirectoryResponse> => {
    return apiClient.put<DirectoryResponse>(`/directories/${directoryId}`, data);
  },

  // DELETE /directories/{directoryId} - Delete directory
  deleteDirectory: async (directoryId: number): Promise<void> => {
    return apiClient.delete<void>(`/directories/${directoryId}`);
  },

  // POST /directories/team/{teamId} - Create team directory
  createTeamDirectory: async (
    teamId: number,
    data: TeamDirectoryCreateRequest,
  ): Promise<TeamDirectoryResponse> => {
    return apiClient.post<TeamDirectoryResponse>(`/directories/team/${teamId}`, data);
  },

  // PUT /directories/{directoryId}/team/{teamId} - Update team directory
  updateTeamDirectory: async (
    directoryId: number,
    teamId: number,
    data: TeamDirectoryUpdateRequest,
  ): Promise<TeamDirectoryResponse> => {
    return apiClient.put<TeamDirectoryResponse>(`/directories/${directoryId}/team/${teamId}`, data);
  },

  // DELETE /directories/{directoryId}/team/{teamId} - Delete team directory
  deleteTeamDirectory: async (directoryId: number, teamId: number): Promise<void> => {
    return apiClient.delete<void>(`/directories/${directoryId}/team/${teamId}`);
  },
};
