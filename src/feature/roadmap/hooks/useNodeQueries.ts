import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nodeApi } from '../api';
import type { NodeCreateRequest, NodeUpdateRequest, EducationNodeConvertRequest } from '../types';

// Query Keys
export const nodeKeys = {
  all: ['nodes'] as const,
  lists: () => [...nodeKeys.all, 'list'] as const,
  list: (roadmapUuid: number) => [...nodeKeys.lists(), roadmapUuid] as const,
  details: () => [...nodeKeys.all, 'detail'] as const,
  detail: (id: number) => [...nodeKeys.details(), id] as const,
};

// ===================================
// Node Queries
// ===================================

export function useNodes(roadmapUuid: number) {
  return useQuery({
    queryKey: nodeKeys.list(roadmapUuid),
    queryFn: () => nodeApi.getNodes(roadmapUuid),
    enabled: !!roadmapUuid,
  });
}

export function useNode(nodeUuid: number) {
  return useQuery({
    queryKey: nodeKeys.detail(nodeUuid),
    queryFn: () => nodeApi.getNode(nodeUuid),
    enabled: !!nodeUuid,
  });
}

// ===================================
// Node Mutations
// ===================================

export function useCreateNode(roadmapUuid: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NodeCreateRequest) => nodeApi.createNode(roadmapUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapUuid) });
    },
  });
}

export function useConvertEducationNode(roadmapUuid: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      educationUuid,
      data,
    }: {
      educationUuid: number;
      data: EducationNodeConvertRequest;
    }) => nodeApi.convertEducationNode(educationUuid, roadmapUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapUuid) });
    },
  });
}

export function useUpdateNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeUuid, data }: { nodeUuid: number; data: NodeUpdateRequest }) =>
      nodeApi.updateNode(nodeUuid, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.detail(data.uuid) });
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(data.roadmapUuid) });
    },
  });
}

export function useDeleteNode(roadmapUuid: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nodeUuid: number) => nodeApi.deleteNode(nodeUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapUuid) });
    },
  });
}
