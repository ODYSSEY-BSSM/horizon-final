import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../api';
import type { TeamCreateRequest, TeamUpdateRequest } from '../types';

// Query Keys
export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: () => [...teamKeys.lists()] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (teamId: number) => [...teamKeys.details(), teamId] as const,
  members: (teamId: number) => [...teamKeys.detail(teamId), 'members'] as const,
  applications: (teamId: number) => [...teamKeys.detail(teamId), 'applications'] as const,
};

// ===================================
// Team Queries
// ===================================

export function useTeams() {
  return useQuery({
    queryKey: teamKeys.list(),
    queryFn: () => teamApi.getTeams(),
  });
}

export function useTeam(teamId: number) {
  return useQuery({
    queryKey: teamKeys.detail(teamId),
    queryFn: () => teamApi.getTeam(teamId),
    enabled: !!teamId,
  });
}

export function useTeamMembers(teamId: number) {
  return useQuery({
    queryKey: teamKeys.members(teamId),
    queryFn: async () => {
      const team = await teamApi.getTeam(teamId);
      return team.members;
    },
    enabled: !!teamId,
  });
}

export function useTeamApplications(teamId: number) {
  return useQuery({
    queryKey: teamKeys.applications(teamId),
    queryFn: async () => {
      // Swagger에는 지원/승인 시스템이 없음 (초대 코드만 사용)
      return [];
    },
    enabled: !!teamId,
  });
}

// ===================================
// Team Mutations
// ===================================

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamCreateRequest) => teamApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

export function useUpdateTeam(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamUpdateRequest) => teamApi.updateTeam(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: number) => teamApi.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

export function useRemoveTeamMember(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberUuid: number) => teamApi.removeMember(teamId, memberUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
    },
  });
}

// ===================================
// Team Apply Mutations
// ===================================

export function useApplyToTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inviteCode }: { inviteCode: string }) => teamApi.joinTeam({ inviteCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

export function useApproveTeamApplication(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applyId: number) => {
      // Swagger에는 승인 시스템이 없음 (초대 코드로 즉시 가입)
      throw new Error('Team approval is not supported. Use invite codes instead.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.applications(teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

export function useRejectTeamApplication(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applyId: number) => {
      // Swagger에는 거절 시스템이 없음 (초대 코드로 즉시 가입)
      throw new Error('Team rejection is not supported. Use invite codes instead.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.applications(teamId) });
    },
  });
}

export function useDeleteTeamApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applyId: number) => {
      // Swagger에는 지원 삭제 시스템이 없음 (초대 코드로 즉시 가입)
      throw new Error('Team application deletion is not supported. Use invite codes instead.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}
