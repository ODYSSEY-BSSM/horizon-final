import { apiClient } from '@/shared/api';
import type {
  TeamApplyActionRequest,
  TeamApplyListResponse,
  TeamApplyRequest,
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
  getTeam: async (teamName: string): Promise<TeamResponse> => {
    const response = await apiClient.get<TeamResponse>(`/teams/${teamName}`);
    return response.data;
  },

  // 팀 수정
  updateTeam: async (teamName: string, data: TeamUpdateRequest): Promise<TeamResponse> => {
    const response = await apiClient.put<TeamResponse>(`/teams/${teamName}`, data);
    return response.data;
  },

  // 팀 삭제
  deleteTeam: async (teamName: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamName}`);
  },

  // 팀 멤버 조회
  getTeamMembers: async (teamName: string): Promise<TeamMembersResponse> => {
    const response = await apiClient.get<TeamMembersResponse>(`/teams/${teamName}/members`);
    return response.data;
  },

  // 팀 멤버 삭제 (추방)
  removeTeamMember: async (teamName: string, memberUuid: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamName}/members/${memberUuid}`);
  },

  // ===================================
  // Team Apply API
  // ===================================

  // 팀 신청 (초대 코드로 가입 신청)
  applyToTeam: async (data: TeamApplyRequest): Promise<TeamApplyResponse> => {
    const response = await apiClient.post<TeamApplyResponse>('/team-applies', data);
    return response.data;
  },

  // 팀 신청 목록 조회 (팀장/관리자용)
  getTeamApplications: async (teamName: string): Promise<TeamApplyListResponse> => {
    const response = await apiClient.get<TeamApplyListResponse>(`/team-applies/teams/${teamName}`);
    return response.data;
  },

  // 팀 신청 수락
  approveTeamApplication: async (applyUuid: number): Promise<TeamApplyResponse> => {
    const response = await apiClient.put<TeamApplyResponse>(`/team-applies/${applyUuid}`, {
      status: 'APPROVED',
    } as TeamApplyActionRequest);
    return response.data;
  },

  // 팀 신청 거절
  rejectTeamApplication: async (applyUuid: number): Promise<TeamApplyResponse> => {
    const response = await apiClient.put<TeamApplyResponse>(`/team-applies/${applyUuid}`, {
      status: 'REJECTED',
    } as TeamApplyActionRequest);
    return response.data;
  },

  // 팀 신청 삭제 (신청 취소)
  deleteTeamApplication: async (applyUuid: number): Promise<void> => {
    await apiClient.delete(`/team-applies/${applyUuid}`);
  },
};
