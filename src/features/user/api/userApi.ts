import axiosInstance from '@/shared/api/instance';
import type { ApiResponse } from '@/shared/types';
import type {
  GetUserInfoResponse,
  SignUpRequest,
  SignUpResponse,
  UpdatePasswordRequest,
  UserInfo,
  VerificationConfirmRequest,
  VerificationRequest,
} from '../types';

export const requestVerificationCode = async (data: VerificationRequest) => {
  return axiosInstance.post('/verification/password', data);
};

export const confirmVerificationCode = async (data: VerificationConfirmRequest) => {
  return axiosInstance.patch('/verification', data);
};

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await axiosInstance.post<SignUpResponse>('/users', data);
  return response.data;
};

export const getUserInfo = async (): Promise<GetUserInfoResponse> => {
  const response = await axiosInstance.get<GetUserInfoResponse>('/users');
  return response.data;
};

export const updatePassword = async (data: UpdatePasswordRequest) => {
  return axiosInstance.put('/users', data);
};

export const connectSchool = async (): Promise<ApiResponse<UserInfo>> => {
  const response = await axiosInstance.put<ApiResponse<UserInfo>>('/users/school');
  return response.data;
};
