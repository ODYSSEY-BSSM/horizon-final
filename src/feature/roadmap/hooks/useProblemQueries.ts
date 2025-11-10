import { useMutation, useQueryClient } from '@tanstack/react-query';
import { problemApi } from '../api';
import type { ProblemCreateRequest, ProblemSolveRequest } from '../types';
import { nodeKeys } from './useNodeQueries';

// ===================================
// Problem Mutations
// ===================================

export function useCreateProblem(nodeUuid: number, roadmapUuid: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProblemCreateRequest) => problemApi.createProblem(nodeUuid, data),
    onSuccess: () => {
      // 노드 정보 갱신 (문제가 추가되면 노드의 isResolved 상태가 변경될 수 있음)
      queryClient.invalidateQueries({ queryKey: nodeKeys.detail(nodeUuid) });
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapUuid) });
    },
  });
}

export function useSolveProblem(nodeUuid: number, roadmapUuid: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ problemUuid, data }: { problemUuid: number; data: ProblemSolveRequest }) =>
      problemApi.solveProblem(problemUuid, data),
    onSuccess: () => {
      // 노드 정보 갱신 (문제 해결 시 노드의 isResolved 상태가 변경될 수 있음)
      queryClient.invalidateQueries({ queryKey: nodeKeys.detail(nodeUuid) });
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapUuid) });
    },
  });
}
