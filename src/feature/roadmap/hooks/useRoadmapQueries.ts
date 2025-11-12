import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { folderKeys } from '@/feature/folder/hooks/useFolderQueries';
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
  lastAccessed: () => [...roadmapKeys.all, 'lastAccessed'] as const,
  team: (teamId: number) => [...roadmapKeys.all, 'team', teamId] as const,
  teamList: (teamId: number) => [...roadmapKeys.team(teamId), 'list'] as const,
  teamDetail: (teamId: number, id: number) => [...roadmapKeys.team(teamId), id] as const,
  teamCount: (teamId: number) => [...roadmapKeys.team(teamId), 'count'] as const,
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
    mutationFn: (roadmapUuid: number) => roadmapApi.toggleFavorite(roadmapUuid),
    onSuccess: (_, roadmapUuid) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(roadmapUuid) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.toggleFavorite(roadmapUuid),
    onSuccess: (_, roadmapUuid) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(roadmapUuid) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
  });
}

export function useGetLastAccessed() {
  return useQuery({
    queryKey: roadmapKeys.lastAccessed(),
    queryFn: () => roadmapApi.getLastAccessed(),
  });
}

// ===================================
// Team Roadmap Queries
// ===================================

export function useTeamRoadmaps(teamId: number) {
  return useQuery({
    queryKey: roadmapKeys.teamList(teamId),
    queryFn: () => roadmapApi.getTeamRoadmaps(teamId),
    enabled: !!teamId,
  });
}

export function useTeamRoadmap(teamId: number, roadmapId: number) {
  return useQuery({
    queryKey: roadmapKeys.teamDetail(teamId, roadmapId),
    queryFn: () =>
      Promise.reject(new Error('Team roadmap single item endpoint not implemented in API')),
    enabled: false, // TODO: API doesn't support this endpoint yet
  });
}

export function useTeamRoadmapCount(teamId: number) {
  return useQuery({
    queryKey: roadmapKeys.teamCount(teamId),
    queryFn: () => Promise.reject(new Error('Team roadmap count endpoint not implemented in API')),
    enabled: false, // TODO: API doesn't support this endpoint yet
  });
}

// ===================================
// Team Roadmap Mutations
// ===================================

export function useCreateTeamRoadmap(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamRoadmapCreateRequest) => roadmapApi.createTeamRoadmap(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamId) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamCount(teamId) });
      queryClient.invalidateQueries({ queryKey: folderKeys.team(teamId) });
    },
  });
}

export function useUpdateTeamRoadmap(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_params: { roadmapId: number; data: TeamRoadmapUpdateRequest }) =>
      Promise.reject(new Error('Team roadmap update endpoint not implemented in API')),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapKeys.teamDetail(teamId, variables.roadmapId),
      });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamId) });
    },
  });
}

export function useDeleteTeamRoadmap(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_roadmapId: number) =>
      Promise.reject(new Error('Team roadmap delete endpoint not implemented in API')),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamId) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamCount(teamId) });
    },
  });
}
