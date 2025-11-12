import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studioApi } from '../api/studioApi';
import type { CreateNodeRequest, StudioNodeData, UpdateNodeRequest } from '../types/node';

const STUDIO_NODES_KEY = 'studio-nodes';

/**
 * Hook to fetch nodes for a roadmap
 */
export function useStudioNodes(roadmapId: number) {
  return useQuery({
    queryKey: [STUDIO_NODES_KEY, roadmapId],
    queryFn: async () => {
      const response = await studioApi.getNodes(roadmapId);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch nodes');
      }
      return response.data;
    },
    enabled: roadmapId > 0,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to create a new node
 */
export function useCreateNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNodeRequest) => {
      const response = await studioApi.createNode(roadmapId, data);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create node');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch nodes
      queryClient.invalidateQueries({ queryKey: [STUDIO_NODES_KEY, roadmapId] });
    },
  });
}

/**
 * Hook to update a node
 */
export function useUpdateNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nodeId, data }: { nodeId: number; data: UpdateNodeRequest }) => {
      const response = await studioApi.updateNode(roadmapId, nodeId, data);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update node');
      }
      return response.data;
    },
    onMutate: async ({ nodeId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [STUDIO_NODES_KEY, roadmapId] });

      // Snapshot previous value
      const previousNodes = queryClient.getQueryData<StudioNodeData[]>([
        STUDIO_NODES_KEY,
        roadmapId,
      ]);

      // Optimistically update
      if (previousNodes) {
        queryClient.setQueryData<StudioNodeData[]>(
          [STUDIO_NODES_KEY, roadmapId],
          previousNodes.map((node) => (node.id === nodeId ? { ...node, ...data } : node)),
        );
      }

      return { previousNodes };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousNodes) {
        queryClient.setQueryData([STUDIO_NODES_KEY, roadmapId], context.previousNodes);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [STUDIO_NODES_KEY, roadmapId] });
    },
  });
}

/**
 * Hook to delete a node
 */
export function useDeleteNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nodeId: number) => {
      const response = await studioApi.deleteNode(roadmapId, nodeId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete node');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch nodes
      queryClient.invalidateQueries({ queryKey: [STUDIO_NODES_KEY, roadmapId] });
    },
  });
}
