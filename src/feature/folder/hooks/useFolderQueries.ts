import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { folderApi } from '../api';
import type {
  DirectoryCreateRequest,
  DirectoryUpdateRequest,
  TeamDirectoryCreateRequest,
  TeamDirectoryUpdateRequest,
} from '../types';

// Query Keys
export const folderKeys = {
  all: ['folders'] as const,
  lists: () => [...folderKeys.all, 'list'] as const,
  list: () => [...folderKeys.lists()] as const,
  details: () => [...folderKeys.all, 'detail'] as const,
  detail: (id: number) => [...folderKeys.details(), id] as const,
  content: (id: number) => [...folderKeys.detail(id), 'content'] as const,
  team: (teamName: string) => [...folderKeys.all, 'team', teamName] as const,
  teamList: (teamName: string) => [...folderKeys.team(teamName), 'list'] as const,
  teamDetail: (teamName: string, id: number) => [...folderKeys.team(teamName), id] as const,
  teamContent: (teamName: string, id: number) =>
    [...folderKeys.teamDetail(teamName, id), 'content'] as const,
};

// ===================================
// Personal Directory Queries
// ===================================

export function useFolders() {
  return useQuery({
    queryKey: folderKeys.list(),
    queryFn: () => folderApi.getDirectories(),
  });
}

export function useFolder(directoryUuid: number) {
  return useQuery({
    queryKey: folderKeys.detail(directoryUuid),
    queryFn: () => folderApi.getDirectory(directoryUuid),
    enabled: !!directoryUuid,
  });
}

export function useFolderContent(directoryUuid: number) {
  return useQuery({
    queryKey: folderKeys.content(directoryUuid),
    queryFn: () => folderApi.getDirectoryContent(directoryUuid),
    enabled: !!directoryUuid,
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
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      directoryUuid,
      data,
    }: {
      directoryUuid: number;
      data: DirectoryUpdateRequest;
    }) => folderApi.updateDirectory(directoryUuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.detail(variables.directoryUuid) });
      queryClient.invalidateQueries({ queryKey: folderKeys.list() });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (directoryUuid: number) => folderApi.deleteDirectory(directoryUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.list() });
    },
  });
}

// ===================================
// Team Directory Queries
// ===================================

export function useTeamFolders(teamName: string) {
  return useQuery({
    queryKey: folderKeys.teamList(teamName),
    queryFn: () => folderApi.getTeamDirectories(teamName),
    enabled: !!teamName,
  });
}

export function useTeamFolder(teamName: string, directoryUuid: number) {
  return useQuery({
    queryKey: folderKeys.teamDetail(teamName, directoryUuid),
    queryFn: () => folderApi.getTeamDirectory(teamName, directoryUuid),
    enabled: !!teamName && !!directoryUuid,
  });
}

export function useTeamFolderContent(teamName: string, directoryUuid: number) {
  return useQuery({
    queryKey: folderKeys.teamContent(teamName, directoryUuid),
    queryFn: () => folderApi.getTeamDirectoryContent(teamName, directoryUuid),
    enabled: !!teamName && !!directoryUuid,
  });
}

// ===================================
// Team Directory Mutations
// ===================================

export function useCreateTeamFolder(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamDirectoryCreateRequest) =>
      folderApi.createTeamDirectory(teamName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.teamList(teamName) });
    },
  });
}

export function useUpdateTeamFolder(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      directoryUuid,
      data,
    }: {
      directoryUuid: number;
      data: TeamDirectoryUpdateRequest;
    }) => folderApi.updateTeamDirectory(teamName, directoryUuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: folderKeys.teamDetail(teamName, variables.directoryUuid),
      });
      queryClient.invalidateQueries({ queryKey: folderKeys.teamList(teamName) });
    },
  });
}

export function useDeleteTeamFolder(teamName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (directoryUuid: number) => folderApi.deleteTeamDirectory(teamName, directoryUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.teamList(teamName) });
    },
  });
}
