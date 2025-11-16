import { apiClient } from '@/shared/api/client';
import type {
  TeamCreateRequest,
  TeamInviteRequest,
  TeamListResponse,
  TeamResponse,
} from '../types/teamApi';

export const realTeamApi = {
  // Swagger: GET /teams → TeamListResponse { teams: string[] }
  getTeams: async (): Promise<TeamListResponse> => {
    return apiClient.get<TeamListResponse>('/teams');
  },

  // Swagger: POST /teams → TeamResponse
  createTeam: async (data: TeamCreateRequest): Promise<TeamResponse> => {
    return apiClient.post<TeamResponse>('/teams', data);
  },

  // Swagger: GET /teams/{id} → TeamResponse
  getTeam: async (teamId: number): Promise<TeamResponse> => {
    return apiClient.get<TeamResponse>(`/teams/${teamId}`);
  },

  // Swagger: DELETE /teams/{id} → 204 No Content
  deleteTeam: async (teamId: number): Promise<void> => {
    return apiClient.delete<void>(`/teams/${teamId}`);
  },

  // Swagger: PATCH /teams → TeamListResponse
  joinTeam: async (data: TeamInviteRequest): Promise<TeamListResponse> => {
    return apiClient.patch<TeamListResponse>('/teams', data);
  },
};
