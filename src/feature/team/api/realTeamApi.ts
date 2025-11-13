/**
 * Real Team API Implementation
 */

import { apiClient } from '@/shared/api/client';
import type {
  TeamCreateRequest,
  TeamInviteRequest,
  TeamListResponse,
  TeamResponse,
} from '../types/teamApi';

export const realTeamApi = {
  // GET /teams - List user teams
  getTeams: async (): Promise<TeamListResponse> => {
    return apiClient.get<TeamListResponse>('/teams');
  },

  // POST /teams - Create team
  createTeam: async (data: TeamCreateRequest): Promise<TeamResponse> => {
    return apiClient.post<TeamResponse>('/teams', data);
  },

  // GET /teams/{id} - Get team details
  getTeam: async (teamId: number): Promise<TeamResponse> => {
    return apiClient.get<TeamResponse>(`/teams/${teamId}`);
  },

  // DELETE /teams/{id} - Delete team
  deleteTeam: async (teamId: number): Promise<void> => {
    return apiClient.delete<void>(`/teams/${teamId}`);
  },

  // PATCH /teams - Join team via invite code
  joinTeam: async (data: TeamInviteRequest): Promise<TeamListResponse> => {
    return apiClient.patch<TeamListResponse>('/teams', data);
  },
};
