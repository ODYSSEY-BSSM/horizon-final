import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nodeApi } from '../api';
import type { EducationNodeConvertRequest, NodeCreateRequest, NodeUpdateRequest } from '../types';

// Query Keys
export const nodeKeys = {
  all: ['nodes'] as const,
  lists: () => [...nodeKeys.all, 'list'] as const,
  list: (roadmapId: number) => [...nodeKeys.lists(), roadmapId] as const,
  details: () => [...nodeKeys.all, 'detail'] as const,
  detail: (roadmapId: number, nodeId: number) =>
    [...nodeKeys.details(), roadmapId, nodeId] as const,
};

// ===================================
// Node Queries
// ===================================

export function useNodes(roadmapId: number) {
  return useQuery({
    queryKey: nodeKeys.list(roadmapId),
    queryFn: () => nodeApi.getNodes(roadmapId),
    enabled: !!roadmapId,
  });
}

export function useNode(roadmapId: number, nodeId: number) {
  return useQuery({
    queryKey: nodeKeys.detail(roadmapId, nodeId),
    queryFn: () => nodeApi.getNode(roadmapId, nodeId),
    enabled: !!roadmapId && !!nodeId,
  });
}

// ===================================
// Node Mutations
// ===================================

export function useCreateNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NodeCreateRequest) => nodeApi.createNode(roadmapId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapId) });
    },
  });
}

export function useConvertEducationNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      educationId,
      data,
    }: {
      educationId: number;
      data: EducationNodeConvertRequest;
    }) => nodeApi.convertEducationNode(educationId, roadmapId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapId) });
    },
  });
}

export function useUpdateNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, data }: { nodeId: number; data: NodeUpdateRequest }) =>
      nodeApi.updateNode(roadmapId, nodeId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.detail(roadmapId, data.id) });
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapId) });
    },
  });
}

export function useMoveNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, data }: { nodeId: number; data: NodeUpdateRequest }) =>
      nodeApi.updateNode(roadmapId, nodeId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.detail(roadmapId, data.id) });
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapId) });
    },
  });
}

export function useDeleteNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nodeId: number) => nodeApi.deleteNode(roadmapId, nodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapId) });
    },
  });
}
