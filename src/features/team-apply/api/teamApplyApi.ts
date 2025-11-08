import axiosInstance from "@/shared/api/instance";
import type {
  ApplyToTeamResponse,
  ApproveApplicationResponse,
  RejectApplicationResponse,
} from "./types";

export const applyToTeam = async (teamId: number): Promise<ApplyToTeamResponse> => {
  const response = await axiosInstance.post<ApplyToTeamResponse>(`/apply/${teamId}`);
  return response.data;
};

export const approveApplication = async (applyId: number): Promise<ApproveApplicationResponse> => {
  const response = await axiosInstance.put<ApproveApplicationResponse>(`/apply/${applyId}/approve`);
  return response.data;
};

export const rejectApplication = async (applyId: number): Promise<RejectApplicationResponse> => {
  const response = await axiosInstance.patch<RejectApplicationResponse>(`/apply/${applyId}/reject`);
  return response.data;
};
