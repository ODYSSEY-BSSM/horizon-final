import axiosInstance from '@/shared/api/instance';
import type {
  CreateNodeRequest,
  CreateNodeResponse,
  DeleteNodeResponse,
  GetNodeResponse,
  GetNodesResponse,
  UpdateNodeRequest,
  UpdateNodeResponse,
} from '../types';

const NODE_API_URL = (roadmapId: number) => `/roadmap/${roadmapId}/nodes`;

export const getNodes = async (roadmapId: number): Promise<GetNodesResponse> => {
  const response = await axiosInstance.get<GetNodesResponse>(NODE_API_URL(roadmapId));
  return response.data;
};

export const getNode = async (roadmapId: number, nodeId: number): Promise<GetNodeResponse> => {
  const response = await axiosInstance.get<GetNodeResponse>(`${NODE_API_URL(roadmapId)}/${nodeId}`);
  return response.data;
};

export const createNode = async (
  roadmapId: number,
  data: CreateNodeRequest,
): Promise<CreateNodeResponse> => {
  const response = await axiosInstance.post<CreateNodeResponse>(NODE_API_URL(roadmapId), data);
  return response.data;
};

export const updateNode = async (
  roadmapId: number,
  nodeId: number,
  data: UpdateNodeRequest,
): Promise<UpdateNodeResponse> => {
  const response = await axiosInstance.put<UpdateNodeResponse>(
    `${NODE_API_URL(roadmapId)}/${nodeId}`,
    data,
  );
  return response.data;
};

export const deleteNode = async (
  roadmapId: number,
  nodeId: number,
): Promise<DeleteNodeResponse> => {
  const response = await axiosInstance.delete<DeleteNodeResponse>(
    `${NODE_API_URL(roadmapId)}/${nodeId}`,
  );
  return response.data;
};
