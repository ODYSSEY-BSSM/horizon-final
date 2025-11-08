import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createNode as createNodeApi,
  deleteNode as deleteNodeApi,
  getNode as getNodeApi,
  getNodes as getNodesApi,
  updateNode as updateNodeApi,
} from '../api/nodeApi';
import { useNodeStore } from '../store/nodeStore';
import type { CreateNodeRequest, UpdateNodeRequest } from '../types';

export const useNode = (roadmapId: number) => {
  const queryClient = useQueryClient();
  const { setNodes, addNode, updateNode, removeNode } = useNodeStore();

  const queryKey = ['nodes', roadmapId];

  const useGetNodes = () => {
    return useQuery({
      queryKey,
      queryFn: async () => {
        const response = await getNodesApi(roadmapId);
        setNodes(roadmapId, response.data);
        return response.data;
      },
    });
  };

  const useGetNode = (nodeId: number) => {
    return useQuery({
      queryKey: [...queryKey, nodeId],
      queryFn: () => getNodeApi(roadmapId, nodeId),
      enabled: !!nodeId,
    });
  };

  const useCreateNode = () => {
    return useMutation({
      mutationFn: (data: CreateNodeRequest) => createNodeApi(roadmapId, data),
      onSuccess: (response) => {
        addNode(roadmapId, response.data);
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };

  const useUpdateNode = (nodeId: number) => {
    return useMutation({
      mutationFn: (data: UpdateNodeRequest) => updateNodeApi(roadmapId, nodeId, data),
      onSuccess: (response) => {
        updateNode(roadmapId, response.data);
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: [...queryKey, nodeId] });
      },
    });
  };

  const useDeleteNode = (nodeId: number) => {
    return useMutation({
      mutationFn: () => deleteNodeApi(roadmapId, nodeId),
      onSuccess: () => {
        removeNode(roadmapId, nodeId);
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };

  return {
    useGetNodes,
    useGetNode,
    useCreateNode,
    useUpdateNode,
    useDeleteNode,
  };
};
