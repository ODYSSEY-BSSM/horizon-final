import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDirectory as createDirectoryApi,
  createTeamDirectory as createTeamDirectoryApi,
  deleteDirectory as deleteDirectoryApi,
  getDirectories as getDirectoriesApi,
  updateDirectory as updateDirectoryApi,
  updateTeamDirectory as updateTeamDirectoryApi,
} from '../api/directoryApi';
import { useDirectoryStore } from '../store/directoryStore';
import type { CreateDirectoryRequest, UpdateDirectoryRequest } from './types';

export const useDirectory = () => {
  const queryClient = useQueryClient();
  const { setDirectories } = useDirectoryStore();

  const queryKey = ['directories'];

  const useGetDirectories = () => {
    return useQuery({
      queryKey,
      queryFn: async () => {
        const response = await getDirectoriesApi();
        setDirectories(response.data);
        return response.data;
      },
    });
  };

  const useCreateDirectory = () => {
    return useMutation({
      mutationFn: (data: CreateDirectoryRequest) => createDirectoryApi(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };

  const useUpdateDirectory = (id: number) => {
    return useMutation({
      mutationFn: (data: UpdateDirectoryRequest) => updateDirectoryApi(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };

  const useDeleteDirectory = (id: number) => {
    return useMutation({
      mutationFn: () => deleteDirectoryApi(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };

  const useCreateTeamDirectory = (teamId: number) => {
    return useMutation({
      mutationFn: (data: CreateDirectoryRequest) => createTeamDirectoryApi(teamId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['team', teamId, 'directories'] });
      },
    });
  };

  const useUpdateTeamDirectory = (directoryId: number, teamId: number) => {
    return useMutation({
      mutationFn: (data: UpdateDirectoryRequest) =>
        updateTeamDirectoryApi(directoryId, teamId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['team', teamId, 'directories'] });
      },
    });
  };

  return {
    useGetDirectories,
    useCreateDirectory,
    useUpdateDirectory,
    useDeleteDirectory,
    useCreateTeamDirectory,
    useUpdateTeamDirectory,
  };
};
