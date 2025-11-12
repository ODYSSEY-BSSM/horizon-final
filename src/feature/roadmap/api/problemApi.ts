import { apiClient } from '@/shared/api';
import type { ProblemCreateRequest, ProblemResponse, ProblemSolveRequest } from '../types';

export const problemApi = {
  // ===================================
  // Problem API
  // ===================================

  // 문제 생성
  createProblem: async (
    roadmapId: number,
    data: ProblemCreateRequest,
  ): Promise<ProblemResponse> => {
    const response = await apiClient.post<ProblemResponse>(`/roadmap/${roadmapId}/problems`, data);
    return response.data;
  },

  // 문제 풀이
  solveProblem: async (
    roadmapId: number,
    problemId: number,
    data: ProblemSolveRequest,
  ): Promise<ProblemResponse> => {
    const response = await apiClient.patch<ProblemResponse>(
      `/roadmap/${roadmapId}/problems?problemId=${problemId}`,
      data,
    );
    return response.data;
  },
};
