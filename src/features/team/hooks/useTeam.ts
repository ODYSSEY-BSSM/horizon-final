import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTeam as createTeamApi,
  deleteTeam as deleteTeamApi,
  getTeam as getTeamApi,
} from '../api/teamApi';
import { useTeamStore } from '../store/teamStore';
import type { CreateTeamRequest } from '../types';

export const useTeam = () => {
  const queryClient = useQueryClient();
  const { setTeam, removeTeam } = useTeamStore();

  const useGetTeam = (id: number) => {
    return useQuery({
      queryKey: ['team', id],
      queryFn: async () => {
        const response = await getTeamApi(id);
        setTeam(response.data);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useCreateTeam = () => {
    return useMutation({
      mutationFn: (data: CreateTeamRequest) => createTeamApi(data),
      onSuccess: (response) => {
        setTeam(response.data);
        queryClient.invalidateQueries({ queryKey: ['teams'] }); // Assuming a list of teams might be fetched elsewhere
      },
    });
  };

  const useDeleteTeam = (id: number) => {
    return useMutation({
      mutationFn: () => deleteTeamApi(id),
      onSuccess: () => {
        removeTeam(id);
        queryClient.invalidateQueries({ queryKey: ['teams'] });
        queryClient.removeQueries({ queryKey: ['team', id] });
      },
    });
  };

  return {
    useGetTeam,
    useCreateTeam,
    useDeleteTeam,
  };
};
