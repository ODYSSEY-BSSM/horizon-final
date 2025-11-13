import { useCallback, useEffect, useState } from 'react';
import type { DeleteMessage, NodeUpdateMessage, RoadmapNodeMessage } from '@/shared/api/stompTypes';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';

export interface UseRoadmapNodesWebSocketOptions {
  roadmapId: number;

  onCreated?: (node: RoadmapNodeMessage) => void;

  onUpdated?: (nodeId: number, updates: NodeUpdateMessage) => void;

  onDeleted?: (nodeId: number) => void;

  autoSubscribe?: boolean;
}

export function useRoadmapNodesWebSocket(options: UseRoadmapNodesWebSocketOptions) {
  const { roadmapId, onCreated, onDeleted, autoSubscribe = true } = options;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const { isConnected, subscribe, unsubscribe, send } = useStompWebSocket();

  const handleCreated = useCallback(
    (message: RoadmapNodeMessage) => {
      onCreated?.(message);
    },
    [onCreated],
  );

  const handleDeleted = useCallback(
    (nodeId: DeleteMessage) => {
      onDeleted?.(nodeId);
    },
    [onDeleted],
  );

  useEffect(() => {
    if (!isConnected || !autoSubscribe || !roadmapId) {
      return;
    }

    const createdTopic = `/topic/node/roadmap/${roadmapId}/created`;
    const deletedTopic = `/topic/node/roadmap/${roadmapId}/deleted`;

    subscribe(createdTopic, handleCreated);
    subscribe(deletedTopic, handleDeleted);

    setIsSubscribed(true);

    return () => {
      unsubscribe(createdTopic);
      unsubscribe(deletedTopic);
      setIsSubscribed(false);
    };
  }, [isConnected, autoSubscribe, roadmapId, subscribe, unsubscribe, handleCreated, handleDeleted]);

  const subscribeNodeUpdate = useCallback(
    (nodeId: number, handler: (updates: NodeUpdateMessage) => void) => {
      if (!isConnected) {
        return;
      }

      const updateTopic = `/topic/roadmap/${roadmapId}/nodes/${nodeId}`;
      subscribe(updateTopic, handler);
    },
    [isConnected, roadmapId, subscribe],
  );

  const unsubscribeNodeUpdate = useCallback(
    (nodeId: number) => {
      const updateTopic = `/topic/roadmap/${roadmapId}/nodes/${nodeId}`;
      unsubscribe(updateTopic);
    },
    [roadmapId, unsubscribe],
  );

  const sendNodeUpdate = useCallback(
    (nodeId: number, updates: NodeUpdateMessage) => {
      if (!isConnected) {
        return;
      }

      const destination = `/app/roadmap/${roadmapId}/nodes/${nodeId}`;
      send(destination, updates);
    },
    [isConnected, roadmapId, send],
  );

  return {
    isConnected,
    isSubscribed,
    subscribeNodeUpdate,
    unsubscribeNodeUpdate,
    sendNodeUpdate,
  };
}
