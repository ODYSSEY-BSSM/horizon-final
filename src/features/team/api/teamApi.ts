import axiosInstance from '@/shared/api/instance';
import type {
  CreateTeamRequest,
  CreateTeamResponse,
  DeleteTeamResponse,
  GetTeamResponse,
} from '../types';

export const createTeam = async (data: CreateTeamRequest): Promise<CreateTeamResponse> => {
  const response = await axiosInstance.post<CreateTeamResponse>('/teams', data);
  return response.data;
};

export const getTeam = async (id: number): Promise<GetTeamResponse> => {
  const response = await axiosInstance.get<GetTeamResponse>(`/teams/${id}`);
  return response.data;
};

export const deleteTeam = async (id: number): Promise<DeleteTeamResponse> => {
  const response = await axiosInstance.delete<DeleteTeamResponse>(`/teams/${id}`);
  return response.data;
};
