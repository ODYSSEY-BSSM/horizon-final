import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roadmapApi } from '../api';
import type {
  RoadmapCreateRequest,
  RoadmapUpdateRequest,
  TeamRoadmapCreateRequest,
  TeamRoadmapUpdateRequest,
} from '../types';

// Query Keys
export const roadmapKeys = {
  all: ['roadmaps'] as const,
  lists: () => [...roadmapKeys.all, 'list'] as const,
  list: (filters?: string) => [...roadmapKeys.lists(), filters] as const,
  details: () => [...roadmapKeys.all, 'detail'] as const,
  detail: (id: number) => [...roadmapKeys.details(), id] as const,
  count: () => [...roadmapKeys.all, 'count'] as const,
  team: (teamName: string) => [...roadmapKeys.all, 'team', teamName] as const,
  teamList: (teamName: string) => [...roadmapKeys.team(teamName), 'list'] as const,
  teamDetail: (teamName: string, id: number) => [...roadmapKeys.team(teamName), id] as const,
  teamCount: (teamName: string) => [...roadmapKeys.team(teamName), 'count'] as const,
};

// ===================================
// Personal Roadmap Queries
// ===================================

export function useRoadmaps() {
  return useQuery({
    queryKey: roadmapKeys.lists(),
    queryFn: () => roadmapApi.getRoadmaps(),
  });
}

export function useRoadmap(roadmapUuid: number) {
  return useQuery({
    queryKey: roadmapKeys.detail(roadmapUuid),
    queryFn: () => roadmapApi.getRoadmap(roadmapUuid),
    enabled: !!roadmapUuid,
  });
}

export function useRoadmapCount() {
  return useQuery({
    queryKey: roadmapKeys.count(),
    queryFn: () => roadmapApi.getRoadmapCount(),
  });
}

// ===================================
// Personal Roadmap Mutations
// ===================================

export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoadmapCreateRequest) => roadmapApi.createRoadmap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.count() });
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapUuid, data }: { roadmapUuid: number; data: RoadmapUpdateRequest }) =>
      roadmapApi.updateRoadmap(roadmapUuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(variables.roadmapUuid) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.deleteRoadmap(roadmapUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.count() });
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.addFavorite(roadmapUuid),
    onSuccess: (_, roadmapUuid) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(roadmapUuid) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.removeFavorite(roadmapUuid),
    onSuccess: (_, roadmapUuid) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(roadmapUuid) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
  });
}

export function useUpdateLastAccessed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.updateLastAccessed(roadmapUuid),
    onSuccess: (_, roadmapUuid) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(roadmapUuid) });
    },
  });
}

// ===================================
// Team Roadmap Queries
// ===================================

export function useTeamRoadmaps(teamName: string) {
  return useQuery({
    queryKey: roadmapKeys.teamList(teamName),
    queryFn: () => roadmapApi.getTeamRoadmaps(teamName),
    enabled: !!teamName,
  });
}

export function useTeamRoadmap(teamName: string, roadmapUuid: number) {
  return useQuery({
    queryKey: roadmapKeys.teamDetail(teamName, roadmapUuid),
    queryFn: () => roadmapApi.getTeamRoadmap(teamName, roadmapUuid),
    enabled: !!teamName && !!roadmapUuid,
  });
}

export function useTeamRoadmapCount(teamName: string) {
  return useQuery({
    queryKey: roadmapKeys.teamCount(teamName),
    queryFn: () => roadmapApi.getTeamRoadmapCount(teamName),
    enabled: !!teamName,
  });
}

// ===================================
// Team Roadmap Mutations
// ===================================

export function useCreateTeamRoadmap(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamRoadmapCreateRequest) => roadmapApi.createTeamRoadmap(teamName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamName) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamCount(teamName) });
    },
  });
}

export function useUpdateTeamRoadmap(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapUuid, data }: { roadmapUuid: number; data: TeamRoadmapUpdateRequest }) =>
      roadmapApi.updateTeamRoadmap(teamName, roadmapUuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapKeys.teamDetail(teamName, variables.roadmapUuid),
      });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamName) });
    },
  });
}

export function useDeleteTeamRoadmap(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.deleteTeamRoadmap(teamName, roadmapUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamName) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamCount(teamName) });
    },
  });
}
