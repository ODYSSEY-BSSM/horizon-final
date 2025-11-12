import { apiClient } from '@/shared/api';
import type {
  TeamApplyListResponse,
  TeamApplyResponse,
  TeamCreateRequest,
  TeamMembersResponse,
  TeamResponse,
  TeamUpdateRequest,
} from '../types';

export const teamApi = {
  // ===================================
  // Team API
  // ===================================

  // 팀 생성
  createTeam: async (data: TeamCreateRequest): Promise<TeamResponse> => {
    const response = await apiClient.post<TeamResponse>('/teams', data);
    return response.data;
  },

  // 팀 전체 조회 (내가 속한 팀 목록)
  getTeams: async (): Promise<TeamResponse[]> => {
    const response = await apiClient.get<TeamResponse[]>('/teams');
    return response.data;
  },

  // 팀 단일 조회
  getTeam: async (teamId: number): Promise<TeamResponse> => {
    const response = await apiClient.get<TeamResponse>(`/teams/${teamId}`);
    return response.data;
  },

  // 팀 수정
  updateTeam: async (teamId: number, data: TeamUpdateRequest): Promise<TeamResponse> => {
    const response = await apiClient.put<TeamResponse>(`/teams/${teamId}`, data);
    return response.data;
  },

  // 팀 삭제
  deleteTeam: async (teamId: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}`);
  },

  // 팀 멤버 조회
  getTeamMembers: async (teamId: number): Promise<TeamMembersResponse> => {
    const response = await apiClient.get<TeamMembersResponse>(`/teams/${teamId}/members`);
    return response.data;
  },

  // 팀 멤버 삭제 (추방)
  removeTeamMember: async (teamId: number, memberUuid: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/members/${memberUuid}`);
  },

  // ===================================
  // Team Apply API
  // ===================================

  // 팀 신청
  applyToTeam: async (teamId: number): Promise<TeamApplyResponse> => {
    const response = await apiClient.post<TeamApplyResponse>(`/apply/${teamId}`);
    return response.data;
  },

  // 팀 신청 목록 조회 (팀장/관리자용)
  getTeamApplications: async (teamId: number): Promise<TeamApplyListResponse> => {
    const response = await apiClient.get<TeamApplyListResponse>(`/apply/teams/${teamId}`);
    return response.data;
  },

  // 팀 신청 수락
  approveTeamApplication: async (applyId: number): Promise<TeamApplyResponse> => {
    const response = await apiClient.put<TeamApplyResponse>(`/apply/${applyId}/approve`, {});
    return response.data;
  },

  // 팀 신청 거절
  rejectTeamApplication: async (applyId: number): Promise<TeamApplyResponse> => {
    const response = await apiClient.patch<TeamApplyResponse>(`/apply/${applyId}/reject`, {});
    return response.data;
  },

  // 팀 신청 삭제 (신청 취소)
  deleteTeamApplication: async (applyId: number): Promise<void> => {
    await apiClient.delete(`/apply/${applyId}`);
  },
};
