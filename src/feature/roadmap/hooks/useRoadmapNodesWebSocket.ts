import { useCallback, useEffect, useState } from 'react';
import type { NodeDeleteMessage, NodeUpdateMessage, RoadmapNodeMessage } from '@/shared/api';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';

export interface UseRoadmapNodesWebSocketOptions {
  roadmapId: number;

  onCreated?: (node: RoadmapNodeMessage) => void;

  onUpdated?: (update: NodeUpdateMessage) => void;

  onDeleted?: (nodeId: number) => void;

  autoSubscribe?: boolean;
}

export function useRoadmapNodesWebSocket(options: UseRoadmapNodesWebSocketOptions) {
  const { roadmapId, onCreated, onUpdated, onDeleted, autoSubscribe = true } = options;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const { isConnected, subscribe, unsubscribe, send } = useStompWebSocket();

  const handleCreated = useCallback(
    (message: RoadmapNodeMessage) => {
      onCreated?.(message);
    },
    [onCreated],
  );

  const handleUpdated = useCallback(
    (update: NodeUpdateMessage) => {
      onUpdated?.(update);
    },
    [onUpdated],
  );

  const handleDeleted = useCallback(
    (nodeId: NodeDeleteMessage) => {
      onDeleted?.(nodeId);
    },
    [onDeleted],
  );

  useEffect(() => {
    if (!isConnected || !autoSubscribe || !roadmapId) {
      return;
    }

    const createdTopic = `/topic/node/roadmap/${roadmapId}/created`;
    const updatedTopic = `/topic/node/roadmap/${roadmapId}/updated`;
    const deletedTopic = `/topic/node/roadmap/${roadmapId}/deleted`;

    subscribe(createdTopic, handleCreated);
    subscribe(updatedTopic, handleUpdated);
    subscribe(deletedTopic, handleDeleted);

    setIsSubscribed(true);

    return () => {
      unsubscribe(createdTopic);
      unsubscribe(updatedTopic);
      unsubscribe(deletedTopic);
      setIsSubscribed(false);
    };
  }, [
    isConnected,
    autoSubscribe,
    roadmapId,
    subscribe,
    unsubscribe,
    handleCreated,
    handleUpdated,
    handleDeleted,
  ]);

  const sendNodeUpdate = useCallback(
    (nodeId: number, data: NodeUpdateMessage['data']) => {
      if (!isConnected) {
        return;
      }

      const destination = `/app/node/${nodeId}/roadmap/${roadmapId}/updated`;
      send(destination, { id: nodeId, data });
    },
    [isConnected, roadmapId, send],
  );

  return {
    isConnected,
    isSubscribed,
    sendNodeUpdate,
  };
}
