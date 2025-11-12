import { apiClient } from '@/shared/api';
import type { ProblemCreateRequest, ProblemResponse, ProblemSolveRequest } from '../types';

export const problemApi = {
  // ===================================
  // Problem API
  // ===================================

  // 문제 생성
  createProblem: async (nodeId: number, data: ProblemCreateRequest): Promise<ProblemResponse> => {
    const response = await apiClient.post<ProblemResponse>(`/${nodeId}/problems`, data);
    return response.data;
  },

  // 문제 풀이
  solveProblem: async (
    nodeId: number,
    problemId: number,
    data: ProblemSolveRequest,
  ): Promise<ProblemResponse> => {
    const response = await apiClient.patch<ProblemResponse>(
      `/${nodeId}/problems?problemId=${problemId}`,
      data,
    );
    return response.data;
  },
};
