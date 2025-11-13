import { useMutation, useQueryClient } from '@tanstack/react-query';
import { problemApi } from '../api';
import type { ProblemCreateRequest, ProblemSolveRequest } from '../types';
import { nodeKeys } from './useNodeQueries';

export function useCreateProblem(nodeId: number, roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProblemCreateRequest) => problemApi.createProblem(nodeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.detail(roadmapId, nodeId) });
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapId) });
    },
  });
}

export function useSolveProblem(nodeId: number, roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ problemId, data }: { problemId: number; data: ProblemSolveRequest }) =>
      problemApi.solveProblem(nodeId, problemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.detail(roadmapId, nodeId) });
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapId) });
    },
  });
}
