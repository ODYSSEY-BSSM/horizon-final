import { apiClient } from '@/shared/api';
import type { ProblemCreateRequest, ProblemResponse, ProblemSolveRequest } from '../types';

export const problemApi = {
  // ===================================
  // Problem API
  // ===================================

  // 문제 생성
  createProblem: async (nodeUuid: number, data: ProblemCreateRequest): Promise<ProblemResponse> => {
    const response = await apiClient.post<ProblemResponse>(`/problems/nodes/${nodeUuid}`, data);
    return response.data;
  },

  // 문제 풀이
  solveProblem: async (problemUuid: number, data: ProblemSolveRequest): Promise<ProblemResponse> => {
    const response = await apiClient.post<ProblemResponse>(
      `/problems/${problemUuid}/solve`,
      data,
    );
    return response.data;
  },
};
