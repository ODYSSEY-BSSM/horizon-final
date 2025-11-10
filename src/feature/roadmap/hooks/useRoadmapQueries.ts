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

/**
 * 개인 로드맵 전체 조회
 */
export function useRoadmaps() {
  return useQuery({
    queryKey: roadmapKeys.lists(),
    queryFn: () => roadmapApi.getRoadmaps(),
  });
}

/**
 * 개인 로드맵 단일 조회
 */
export function useRoadmap(roadmapUuid: number) {
  return useQuery({
    queryKey: roadmapKeys.detail(roadmapUuid),
    queryFn: () => roadmapApi.getRoadmap(roadmapUuid),
    enabled: !!roadmapUuid,
  });
}

/**
 * 개인 로드맵 개수 조회
 */
export function useRoadmapCount() {
  return useQuery({
    queryKey: roadmapKeys.count(),
    queryFn: () => roadmapApi.getRoadmapCount(),
  });
}

// ===================================
// Personal Roadmap Mutations
// ===================================

/**
 * 개인 로드맵 생성
 */
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

/**
 * 개인 로드맵 수정
 */
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

/**
 * 개인 로드맵 삭제
 */
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

/**
 * 즐겨찾기 추가
 */
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

/**
 * 즐겨찾기 삭제
 */
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

/**
 * 마지막 접속 시간 갱신
 */
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

/**
 * 팀 로드맵 전체 조회
 */
export function useTeamRoadmaps(teamName: string) {
  return useQuery({
    queryKey: roadmapKeys.teamList(teamName),
    queryFn: () => roadmapApi.getTeamRoadmaps(teamName),
    enabled: !!teamName,
  });
}

/**
 * 팀 로드맵 단일 조회
 */
export function useTeamRoadmap(teamName: string, roadmapUuid: number) {
  return useQuery({
    queryKey: roadmapKeys.teamDetail(teamName, roadmapUuid),
    queryFn: () => roadmapApi.getTeamRoadmap(teamName, roadmapUuid),
    enabled: !!teamName && !!roadmapUuid,
  });
}

/**
 * 팀 로드맵 개수 조회
 */
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

/**
 * 팀 로드맵 생성
 */
export function useCreateTeamRoadmap(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamRoadmapCreateRequest) =>
      roadmapApi.createTeamRoadmap(teamName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamName) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamCount(teamName) });
    },
  });
}

/**
 * 팀 로드맵 수정
 */
export function useUpdateTeamRoadmap(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roadmapUuid,
      data,
    }: {
      roadmapUuid: number;
      data: TeamRoadmapUpdateRequest;
    }) => roadmapApi.updateTeamRoadmap(teamName, roadmapUuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapKeys.teamDetail(teamName, variables.roadmapUuid),
      });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamName) });
    },
  });
}

/**
 * 팀 로드맵 삭제
 */
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
