
import { apiClient } from '@/shared/api/client';
import type {
  TeamCreateRequest,
  TeamInviteRequest,
  TeamListResponse,
  TeamResponse,
} from '../types/teamApi';

export const realTeamApi = {
  getTeams: async (): Promise<TeamListResponse> => {
    return apiClient.get<TeamListResponse>('/teams');
  },

  createTeam: async (data: TeamCreateRequest): Promise<TeamResponse> => {
    return apiClient.post<TeamResponse>('/teams', data);
  },

  getTeam: async (teamId: number): Promise<TeamResponse> => {
    return apiClient.get<TeamResponse>(`/teams/${teamId}`);
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    return apiClient.delete<void>(`/teams/${teamId}`);
  },

  joinTeam: async (data: TeamInviteRequest): Promise<TeamListResponse> => {
    return apiClient.patch<TeamListResponse>('/teams', data);
  },
};
