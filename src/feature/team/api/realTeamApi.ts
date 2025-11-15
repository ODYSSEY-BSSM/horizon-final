import { apiClient } from '@/shared/api/client';
import type {
  TeamCreateRequest,
  TeamInviteRequest,
  TeamResponse,
  TeamUpdateRequest,
} from '../types/teamApi';

export const realTeamApi = {
  getTeams: async (): Promise<TeamResponse[]> => {
    const response = await apiClient.get<{ teams: string[] }>('/teams');

    // API는 teams: string[] (팀 ID 배열)을 반환하므로, 각 팀의 상세 정보를 조회
    const teamIds = response.teams.map((teamId) => parseInt(teamId, 10));
    const teamDetailsPromises = teamIds.map((id) =>
      apiClient.get<TeamResponse>(`/teams/${id}`).catch(() => null),
    );

    const teamDetails = await Promise.all(teamDetailsPromises);
    return teamDetails.filter((team): team is TeamResponse => team !== null);
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
    return apiClient.patch<TeamResponse>('/teams', data);
  },
};
