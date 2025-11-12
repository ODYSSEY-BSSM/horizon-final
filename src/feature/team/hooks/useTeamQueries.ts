import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../api';
import type { TeamApplyRequest, TeamCreateRequest, TeamUpdateRequest } from '../types';

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

export function useTeams() {
  return useQuery({
    queryKey: teamKeys.list(),
    queryFn: () => teamApi.getTeams(),
  });
}

export function useTeam(teamName: string) {
  return useQuery({
    queryKey: teamKeys.detail(teamName),
    queryFn: () => teamApi.getTeam(teamName),
    enabled: !!teamName,
  });
}

export function useTeamMembers(teamName: string) {
  return useQuery({
    queryKey: teamKeys.members(teamName),
    queryFn: () => teamApi.getTeamMembers(teamName),
    enabled: !!teamName,
  });
}

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

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamCreateRequest) => teamApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

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

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamName: string) => teamApi.deleteTeam(teamName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

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

export function useApplyToTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamApplyRequest) => teamApi.applyToTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() });
    },
  });
}

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

export function useRejectTeamApplication(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applyUuid: number) => teamApi.rejectTeamApplication(applyUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.applications(teamName) });
    },
  });
}

export function useDeleteTeamApplication(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applyUuid: number) => teamApi.deleteTeamApplication(applyUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.applications(teamName) });
    },
  });
}
