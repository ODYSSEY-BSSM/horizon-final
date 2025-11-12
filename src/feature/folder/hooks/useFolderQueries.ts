import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { folderApi, teamFolderApi } from '../api';
import type {
  DirectoryCreateRequest,
  DirectoryUpdateRequest,
  TeamDirectoryCreateRequest,
  TeamDirectoryUpdateRequest,
} from '../types';

// Query Keys
export const folderKeys = {
  all: ['folders'] as const,
  root: () => [...folderKeys.all, 'root'] as const,
  lists: () => [...folderKeys.all, 'list'] as const,
  list: () => [...folderKeys.lists()] as const,
  details: () => [...folderKeys.all, 'detail'] as const,
  detail: (id: number) => [...folderKeys.details(), id] as const,
  content: (id: number) => [...folderKeys.detail(id), 'content'] as const,
  team: (teamId: number) => [...folderKeys.all, 'team', teamId] as const,
  teamList: (teamId: number) => [...folderKeys.team(teamId), 'list'] as const,
  teamDetail: (teamId: number, directoryId: number) =>
    [...folderKeys.team(teamId), directoryId] as const,
  teamContent: (teamId: number, directoryId: number) =>
    [...folderKeys.teamDetail(teamId, directoryId), 'content'] as const,
};

// ===================================
// Personal Directory Queries
// ===================================

export function useRootFolder() {
  return useQuery({
    queryKey: folderKeys.root(),
    queryFn: () => folderApi.getDirectories(),
  });
}

// ===================================
// Personal Directory Mutations
// ===================================

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DirectoryCreateRequest) => folderApi.createDirectory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.list() });
      queryClient.invalidateQueries({ queryKey: folderKeys.root() });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ directoryId, data }: { directoryId: number; data: DirectoryUpdateRequest }) =>
      folderApi.updateDirectory(directoryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.detail(variables.directoryId) });
      queryClient.invalidateQueries({ queryKey: folderKeys.list() });
      queryClient.invalidateQueries({ queryKey: folderKeys.root() });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (directoryId: number) => folderApi.deleteDirectory(directoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.list() });
      queryClient.invalidateQueries({ queryKey: folderKeys.root() });
    },
  });
}

// ===================================
// Team Directory Queries
// ===================================

export function useTeamRootFolder(teamId: number) {
  return useQuery({
    queryKey: folderKeys.team(teamId),
    queryFn: () => teamFolderApi.getTeamDirectories(teamId),
  });
}

// ===================================
// Team Directory Mutations
// ===================================

export function useCreateTeamFolder(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamDirectoryCreateRequest) =>
      teamFolderApi.createTeamDirectory(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.teamList(teamId) });
      queryClient.invalidateQueries({ queryKey: folderKeys.team(teamId) });
    },
  });
}

export function useUpdateTeamFolder(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      directoryId,
      data,
    }: {
      directoryId: number;
      data: TeamDirectoryUpdateRequest;
    }) => teamFolderApi.updateTeamDirectory(directoryId, teamId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: folderKeys.teamDetail(teamId, variables.directoryId),
      });
      queryClient.invalidateQueries({ queryKey: folderKeys.teamList(teamId) });
    },
  });
}

export function useDeleteTeamFolder(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (directoryId: number) => teamFolderApi.deleteTeamDirectory(directoryId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.teamList(teamId) });
    },
  });
}
