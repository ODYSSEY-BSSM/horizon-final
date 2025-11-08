import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStomp } from '@/shared/hooks/useStomp';
import {
  createNode as createNodeApi,
  deleteNode as deleteNodeApi,
  updateNode as updateNodeApi,
} from '../api/nodeApi';
import { useNodeStore } from '../store/nodeStore';
import type {
  CreateNodeRequest,
  CursorPosition,
  Node,
  UpdateNodeRequest,
  UserCursor,
} from './types';

export const useNode = (roadmapId: number) => {
  const _queryClient = useQueryClient();
  const { addNode, updateNode, removeNode, updateCursor } = useNodeStore();

  // HTTP Mutations
  const useCreateNode = () =>
    useMutation({
      mutationFn: (data: CreateNodeRequest) => createNodeApi(roadmapId, data),
    });

  const useUpdateNode = (nodeId: number) =>
    useMutation({
      mutationFn: (data: UpdateNodeRequest) => updateNodeApi(roadmapId, nodeId, data),
    });

  const useDeleteNode = (nodeId: number) =>
    useMutation({
      mutationFn: () => deleteNodeApi(roadmapId, nodeId),
    });

  // WebSocket Subscriptions and Publishers
  const { publish } = useStomp(null, () => {
    /* no-op */
  }); // Base hook for publishing

  const useNodeSubscription = () => {
    useStomp(`/topic/node/roadmap/${roadmapId}/created`, (message) => {
      const node = JSON.parse(message.body) as Node;
      addNode(roadmapId, node);
    });
    useStomp(`/topic/node/roadmap/${roadmapId}/deleted`, (message) => {
      const nodeId = JSON.parse(message.body) as number;
      removeNode(roadmapId, nodeId);
    });
  };

  const useSpecificNodeSubscription = (nodeId: number) => {
    useStomp(`/topic/roadmap/${roadmapId}/nodes/${nodeId}`, (message) => {
      const node = JSON.parse(message.body) as Node;
      updateNode(roadmapId, node);
    });
  };

  const publishNodeUpdate = (nodeId: number, data: UpdateNodeRequest) => {
    publish(`/app/roadmap/${roadmapId}/nodes/${nodeId}`, JSON.stringify(data));
  };

  const useCursorSubscription = () => {
    useStomp(`/topic/roadmap/${roadmapId}/cursor`, (message) => {
      const cursor = JSON.parse(message.body) as UserCursor;
      updateCursor(roadmapId, cursor);
    });
  };

  const publishCursorPosition = (position: CursorPosition) => {
    publish(`/app/roadmap/${roadmapId}/cursor`, JSON.stringify(position));
  };

  return {
    useCreateNode,
    useUpdateNode,
    useDeleteNode,
    useNodeSubscription,
    useSpecificNodeSubscription,
    publishNodeUpdate,
    useCursorSubscription,
    publishCursorPosition,
  };
};
