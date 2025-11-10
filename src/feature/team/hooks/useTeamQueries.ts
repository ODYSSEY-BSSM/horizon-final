import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../api';
import type { TeamCreateRequest, TeamUpdateRequest, TeamApplyRequest } from '../types';

// Query Keys
export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: () => [...teamKeys.lists()] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (teamName: string) => [...teamKeys.details(), teamName] as const,
  members: (teamName: string) => [...teamKeys.detail(teamName), 'members'] as const,
  applications: (teamName: string) => [...teamKeys.detail(teamName), 'applications'] as const,
};

// ===================================
// Team Queries
// ===================================

/**
 * 팀 전체 조회 (내가 속한 팀 목록)
 */
export function useTeams() {
  return useQuery({
    queryKey: teamKeys.list(),
    queryFn: () => teamApi.getTeams(),
  });
}

/**
 * 팀 단일 조회
 */
export function useTeam(teamName: string) {
  return useQuery({
    queryKey: teamKeys.detail(teamName),
    queryFn: () => teamApi.getTeam(teamName),
    enabled: !!teamName,
  });
}

/**
 * 팀 멤버 조회
 */
export function useTeamMembers(teamName: string) {
  return useQuery({
    queryKey: teamKeys.members(teamName),
    queryFn: () => teamApi.getTeamMembers(teamName),
    enabled: !!teamName,
  });
}

/**
 * 팀 신청 목록 조회
 */
export function useTeamApplications(teamName: string) {
  return useQuery({
    queryKey: teamKeys.applications(teamName),
    queryFn: () => teamApi.getTeamApplications(teamName),
    enabled: !!teamName,
  });
}

// ===================================
// Team Mutations
// ===================================

/**
 * 팀 생성
 */
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamCreateRequest) => teamApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

/**
 * 팀 수정
 */
export function useUpdateTeam(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamUpdateRequest) => teamApi.updateTeam(teamName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamName) });
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

/**
 * 팀 삭제
 */
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamName: string) => teamApi.deleteTeam(teamName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

/**
 * 팀 멤버 삭제 (추방)
 */
export function useRemoveTeamMember(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberUuid: number) => teamApi.removeTeamMember(teamName, memberUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(teamName) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamName) });
    },
  });
}

// ===================================
// Team Apply Mutations
// ===================================

/**
 * 팀 신청 (초대 코드로 가입 신청)
 */
export function useApplyToTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamApplyRequest) => teamApi.applyToTeam(data),
    onSuccess: () => {
      // 팀 목록이 변경될 수 있으므로 갱신
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

/**
 * 팀 신청 수락
 */
export function useApproveTeamApplication(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applyUuid: number) => teamApi.approveTeamApplication(applyUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.applications(teamName) });
      queryClient.invalidateQueries({ queryKey: teamKeys.members(teamName) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamName) });
    },
  });
}

/**
 * 팀 신청 거절
 */
export function useRejectTeamApplication(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applyUuid: number) => teamApi.rejectTeamApplication(applyUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.applications(teamName) });
    },
  });
}

/**
 * 팀 신청 삭제 (신청 취소)
 */
export function useDeleteTeamApplication(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applyUuid: number) => teamApi.deleteTeamApplication(applyUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.applications(teamName) });
    },
  });
}
