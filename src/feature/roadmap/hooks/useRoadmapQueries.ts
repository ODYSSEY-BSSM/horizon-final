import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { folderKeys } from '@/feature/folder/hooks/useFolderQueries';
import { useToast } from '@/shared/hooks/useToast';
import { roadmapApi } from '../api';
import type {
  RoadmapCreateRequest,
  RoadmapUpdateRequest,
  TeamRoadmapCreateRequest,
  TeamRoadmapUpdateRequest,
} from '../types';

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

export function useAllTeamRoadmaps(teamIds: number[]) {
  return useQuery({
    queryKey: [...roadmapKeys.lists(), 'teams', ...teamIds],
    queryFn: async () => {
      if (!teamIds || teamIds.length === 0) {
        return [];
      }

      const roadmapsPromises = teamIds.map((teamId) => roadmapApi.getTeamRoadmaps(teamId));
      const roadmapsArrays = await Promise.all(roadmapsPromises);
      return roadmapsArrays.flat();
    },
    enabled: teamIds && teamIds.length > 0,
  });
}

export function useRoadmapCount() {
  return useQuery({
    queryKey: roadmapKeys.count(),
    queryFn: () => roadmapApi.getRoadmapCount(),
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RoadmapCreateRequest) => roadmapApi.createRoadmap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.count() });
      toast({
        title: '로드맵 생성 완료',
        description: '새로운 로드맵이 성공적으로 생성되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '로드맵 생성 실패',
        description: error.message,
      });
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ roadmapUuid, data }: { roadmapUuid: number; data: RoadmapUpdateRequest }) =>
      roadmapApi.updateRoadmap(roadmapUuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(variables.roadmapUuid) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      toast({
        title: '로드맵 수정 완료',
        description: '로드맵이 성공적으로 수정되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '로드맵 수정 실패',
        description: error.message,
      });
    },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.deleteRoadmap(roadmapUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.count() });
      toast({
        title: '로드맵 삭제 완료',
        description: '로드맵이 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '로드맵 삭제 실패',
        description: error.message,
      });
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.toggleFavorite(roadmapUuid),
    onSuccess: (_, roadmapUuid) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(roadmapUuid) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '즐겨찾기 실패',
        description: error.message,
      });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (roadmapUuid: number) => roadmapApi.toggleFavorite(roadmapUuid),
    onSuccess: (_, roadmapUuid) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(roadmapUuid) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '즐겨찾기 해제 실패',
        description: error.message,
      });
    },
  });
}

export function useGetLastAccessed() {
  return useQuery({
    queryKey: roadmapKeys.lastAccessed(),
    queryFn: () => roadmapApi.getLastAccessed(),
  });
}

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
    queryFn: () => roadmapApi.getTeamRoadmap(teamId, roadmapId),
    enabled: !!teamId && !!roadmapId,
  });
}

export function useTeamRoadmapCount(teamId: number) {
  return useQuery({
    queryKey: roadmapKeys.teamCount(teamId),
    queryFn: () => roadmapApi.getTeamRoadmapCount(teamId),
    enabled: !!teamId,
  });
}

export function useCreateTeamRoadmap(teamId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: TeamRoadmapCreateRequest) => roadmapApi.createTeamRoadmap(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamId) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamCount(teamId) });
      queryClient.invalidateQueries({ queryKey: folderKeys.team(teamId) });
      toast({
        title: '팀 로드맵 생성 완료',
        description: '새로운 팀 로드맵이 성공적으로 생성되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '팀 로드맵 생성 실패',
        description: error.message,
      });
    },
  });
}

export function useUpdateTeamRoadmap(teamId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: { roadmapId: number; data: TeamRoadmapUpdateRequest }) =>
      roadmapApi.updateTeamRoadmap(teamId, params.roadmapId, params.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapKeys.teamDetail(teamId, variables.roadmapId),
      });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamId) });
      toast({
        title: '팀 로드맵 수정 완료',
        description: '팀 로드맵이 성공적으로 수정되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '팀 로드맵 수정 실패',
        description: error.message,
      });
    },
  });
}

export function useDeleteTeamRoadmap(teamId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (roadmapId: number) => roadmapApi.deleteTeamRoadmap(teamId, roadmapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamList(teamId) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.teamCount(teamId) });
      toast({
        title: '팀 로드맵 삭제 완료',
        description: '팀 로드맵이 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '팀 로드맵 삭제 실패',
        description: error.message,
      });
    },
  });
}
