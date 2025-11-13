import { apiClient } from '@/shared/api/client';
import type {
  TeamCreateRequest,
  TeamInviteRequest,
  TeamResponse,
  TeamUpdateRequest,
} from '../types/teamApi';

export const realTeamApi = {
  getTeams: async (): Promise<TeamResponse[]> => {
    const response = await apiClient.get<{ teams: TeamResponse[] }>('/teams');
    return response.teams;
  },

  createTeam: async (data: TeamCreateRequest): Promise<TeamResponse> => {
    return apiClient.post<TeamResponse>('/teams', data);
  },

  getTeam: async (teamId: number): Promise<TeamResponse> => {
    return apiClient.get<TeamResponse>(`/teams/${teamId}`);
  },

  updateTeam: async (teamId: number, data: TeamUpdateRequest): Promise<TeamResponse> => {
    return apiClient.put<TeamResponse>(`/teams/${teamId}`, data);
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    return apiClient.delete<void>(`/teams/${teamId}`);
  },

  joinTeam: async (data: TeamInviteRequest): Promise<TeamResponse> => {
    return apiClient.patch<TeamResponse>('/teams/join', data);
  },

  leaveTeam: async (teamId: number): Promise<void> => {
    return apiClient.delete<void>(`/teams/${teamId}/leave`);
  },

  removeMember: async (teamId: number, memberId: number): Promise<void> => {
    return apiClient.delete<void>(`/teams/${teamId}/members/${memberId}`);
  },
};
