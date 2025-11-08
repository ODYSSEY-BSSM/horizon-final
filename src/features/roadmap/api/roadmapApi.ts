import axiosInstance from '@/shared/api/instance';
import type {
  CreateRoadmapRequest,
  CreateRoadmapResponse,
  GetRoadmapsResponse,
  GetTeamRoadmapsResponse,
} from '../types';

export const createRoadmap = async (data: CreateRoadmapRequest): Promise<CreateRoadmapResponse> => {
  const response = await axiosInstance.post<CreateRoadmapResponse>('/roadmap', data);
  return response.data;
};

export const createTeamRoadmap = async (
  teamId: number,
  data: CreateRoadmapRequest,
): Promise<CreateRoadmapResponse> => {
  const response = await axiosInstance.post<CreateRoadmapResponse>(
    `/teams/${teamId}/roadmap`,
    data,
  );
  return response.data;
};

export const getRoadmaps = async (): Promise<GetRoadmapsResponse> => {
  const response = await axiosInstance.get<GetRoadmapsResponse>('/roadmap');
  return response.data;
};

export const getTeamRoadmaps = async (teamId: number): Promise<GetTeamRoadmapsResponse> => {
  const response = await axiosInstance.get<GetTeamRoadmapsResponse>(`/teams/${teamId}/roadmap`);
  return response.data;
};
