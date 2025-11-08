import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRoadmap as createRoadmapApi,
  createTeamRoadmap as createTeamRoadmapApi,
  getRoadmaps as getRoadmapsApi,
  getTeamRoadmaps as getTeamRoadmapsApi,
} from '../api/roadmapApi';
import { useRoadmapStore } from '../store/roadmapStore';
import type { CreateRoadmapRequest } from '../types';

export const useRoadmap = () => {
  const queryClient = useQueryClient();
  const { setRoadmaps, setTeamRoadmaps, addRoadmap, addTeamRoadmap } = useRoadmapStore();

  const useGetRoadmaps = () => {
    return useQuery({
      queryKey: ['roadmaps'],
      queryFn: async () => {
        const response = await getRoadmapsApi();
        setRoadmaps(response.data);
        return response.data;
      },
    });
  };

  const useGetTeamRoadmaps = (teamId: number) => {
    return useQuery({
      queryKey: ['teamRoadmaps', teamId],
      queryFn: async () => {
        const response = await getTeamRoadmapsApi(teamId);
        setTeamRoadmaps(response.data);
        return response.data;
      },
      enabled: !!teamId,
    });
  };

  const useCreateRoadmap = () => {
    return useMutation({
      mutationFn: (data: CreateRoadmapRequest) => createRoadmapApi(data),
      onSuccess: (response) => {
        addRoadmap(response.data);
        queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      },
    });
  };

  const useCreateTeamRoadmap = (teamId: number) => {
    return useMutation({
      mutationFn: (data: CreateRoadmapRequest) => createTeamRoadmapApi(teamId, data),
      onSuccess: (response) => {
        addTeamRoadmap({ ...response.data, teamId, teamName: '' }); // teamName은 별도로 가져와야 할 수 있습니다.
        queryClient.invalidateQueries({ queryKey: ['teamRoadmaps', teamId] });
      },
    });
  };

  return {
    useGetRoadmaps,
    useGetTeamRoadmaps,
    useCreateRoadmap,
    useCreateTeamRoadmap,
  };
};
