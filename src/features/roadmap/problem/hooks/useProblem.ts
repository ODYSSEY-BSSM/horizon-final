import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProblem as createProblemApi,
  solveProblem as solveProblemApi,
} from './api/problemApi';
import { useProblemStore } from './store/problemStore';
import type { CreateProblemRequest, SolveProblemRequest } from './types';

export const useProblem = (roadmapId: number) => {
  const queryClient = useQueryClient();
  const { addProblem, updateProblem } = useProblemStore();

  const useCreateProblem = () => {
    return useMutation({
      mutationFn: (data: CreateProblemRequest) => createProblemApi(roadmapId, data),
      onSuccess: (response) => {
        addProblem(roadmapId, response.data);
        queryClient.invalidateQueries({ queryKey: ['problems', roadmapId] });
      },
    });
  };

  const useSolveProblem = (problemId: number) => {
    return useMutation({
      mutationFn: (data: SolveProblemRequest) => solveProblemApi(roadmapId, problemId, data),
      onSuccess: (response) => {
        updateProblem(roadmapId, response.data);
        queryClient.invalidateQueries({ queryKey: ['problems', roadmapId] });
        queryClient.invalidateQueries({ queryKey: ['problem', roadmapId, problemId] });
      },
    });
  };

  return { useCreateProblem, useSolveProblem };
};
