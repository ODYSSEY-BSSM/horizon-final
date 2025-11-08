import axiosInstance from '@/shared/api/instance';
import type { ApiResponse, CreateNodeRequest, Node, UpdateNodeRequest } from '../types';

const NODE_API_URL = (roadmapId: number) => `/roadmap/${roadmapId}/nodes`;

export const getNodes = async (roadmapId: number): Promise<ApiResponse<Node[]>> => {
  const response = await axiosInstance.get<ApiResponse<Node[]>>(NODE_API_URL(roadmapId));
  return response.data;
};

export const createNode = async (
  roadmapId: number,
  data: CreateNodeRequest,
): Promise<ApiResponse<Node>> => {
  const response = await axiosInstance.post<ApiResponse<Node>>(NODE_API_URL(roadmapId), data);
  return response.data;
};

export const updateNode = async (
  roadmapId: number,
  nodeId: number,
  data: UpdateNodeRequest,
): Promise<ApiResponse<Node>> => {
  const response = await axiosInstance.put<ApiResponse<Node>>(
    `${NODE_API_URL(roadmapId)}/${nodeId}`,
    data,
  );
  return response.data;
};

export const deleteNode = async (
  roadmapId: number,
  nodeId: number,
): Promise<ApiResponse<number>> => {
  const response = await axiosInstance.delete<ApiResponse<number>>(
    `${NODE_API_URL(roadmapId)}/${nodeId}`,
  );
  return response.data;
};
