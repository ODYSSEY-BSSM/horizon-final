import { apiClient } from '@/shared/api/client';
import type { ProblemCreateRequest, ProblemResponse, ProblemSolveRequest } from '../types/problem';

export const realProblemApi = {
  createProblem: async (nodeId: number, data: ProblemCreateRequest): Promise<ProblemResponse> => {
    return apiClient.post<ProblemResponse>(`/nodes/${nodeId}/problems`, data);
  },

  solveProblem: async (
    nodeId: number,
    problemId: number,
    data: ProblemSolveRequest,
  ): Promise<ProblemResponse> => {
    return apiClient.patch<ProblemResponse>(`/nodes/${nodeId}/problems/${problemId}`, data);
  },
};
