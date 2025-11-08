import axiosInstance from '@/shared/api/instance';
import type { LoginRequest, LoginResponse } from '../types/login';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth', data);
  return response.data;
};

export const logout = async () => {
  await axiosInstance.delete('/auth');
};
