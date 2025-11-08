import axiosInstance from '@/shared/api/instance';
import type {
  CreateProblemRequest,
  CreateProblemResponse,
  SolveProblemRequest,
  SolveProblemResponse,
} from './types';

export const createProblem = async (
  roadmapId: number,
  data: CreateProblemRequest,
): Promise<CreateProblemResponse> => {
  const response = await axiosInstance.post<CreateProblemResponse>(`/${roadmapId}/problems`, data);
  return response.data;
};

export const solveProblem = async (
  roadmapId: number,
  problemId: number,
  data: SolveProblemRequest,
): Promise<SolveProblemResponse> => {
  const response = await axiosInstance.patch<SolveProblemResponse>(
    `/${roadmapId}/problems?problemId=${problemId}`,
    data,
  );
  return response.data;
};
