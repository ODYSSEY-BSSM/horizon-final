import axiosInstance from '@/shared/api/instance';
import type {
  CreateDirectoryRequest,
  CreateDirectoryResponse,
  CreateTeamDirectoryResponse,
  DeleteDirectoryResponse,
  GetDirectoriesResponse,
  UpdateDirectoryRequest,
  UpdateDirectoryResponse,
  UpdateTeamDirectoryResponse,
} from '../types';

// Personal Directory API
export const getDirectories = async (): Promise<GetDirectoriesResponse> => {
  const response = await axiosInstance.get<GetDirectoriesResponse>('/directories');
  return response.data;
};

export const createDirectory = async (
  data: CreateDirectoryRequest,
): Promise<CreateDirectoryResponse> => {
  const response = await axiosInstance.post<CreateDirectoryResponse>('/directories', data);
  return response.data;
};

export const updateDirectory = async (
  id: number,
  data: UpdateDirectoryRequest,
): Promise<UpdateDirectoryResponse> => {
  const response = await axiosInstance.put<UpdateDirectoryResponse>(`/directories/${id}`, data);
  return response.data;
};

export const deleteDirectory = async (id: number): Promise<DeleteDirectoryResponse> => {
  const response = await axiosInstance.delete<DeleteDirectoryResponse>(`/directories/${id}`);
  return response.data;
};

// Team Directory API
export const createTeamDirectory = async (
  teamId: number,
  data: CreateDirectoryRequest,
): Promise<CreateTeamDirectoryResponse> => {
  const response = await axiosInstance.post<CreateTeamDirectoryResponse>(
    `/directories/team/${teamId}`,
    data,
  );
  return response.data;
};

export const updateTeamDirectory = async (
  directoryId: number,
  teamId: number,
  data: UpdateDirectoryRequest,
): Promise<UpdateTeamDirectoryResponse> => {
  const response = await axiosInstance.put<UpdateTeamDirectoryResponse>(
    `/directories/${directoryId}/team/${teamId}`,
    data,
  );
  return response.data;
};
