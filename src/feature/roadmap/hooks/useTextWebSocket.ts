import { useCallback, useEffect, useState } from 'react';
import type { TextDeleteMessage, TextMessage, TextUpdateMessage } from '@/shared/api';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';

export interface UseTextWebSocketOptions {
  roadmapId: number;

  onCreated?: (text: TextMessage['texts']) => void;

  onUpdated?: (update: TextUpdateMessage) => void;

  onDeleted?: (textId: number) => void;

  autoSubscribe?: boolean;
}

export function useTextWebSocket(options: UseTextWebSocketOptions) {
  const { roadmapId, onCreated, onUpdated, onDeleted, autoSubscribe = true } = options;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const { isConnected, subscribe, unsubscribe, send } = useStompWebSocket();

  const handleCreated = useCallback(
    (message: TextMessage) => {
      onCreated?.(message.texts);
    },
    [onCreated],
  );

  const handleUpdated = useCallback(
    (update: TextUpdateMessage) => {
      onUpdated?.(update);
    },
    [onUpdated],
  );

  const handleDeleted = useCallback(
    (textId: TextDeleteMessage) => {
      onDeleted?.(textId);
    },
    [onDeleted],
  );

  useEffect(() => {
    if (!isConnected || !autoSubscribe || !roadmapId) {
      return;
    }

    const createdTopic = `/topic/text/roadmap/${roadmapId}/created`;
    const updatedTopic = `/topic/text/roadmap/${roadmapId}/updated`;
    const deletedTopic = `/topic/text/roadmap/${roadmapId}/deleted`;

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

  const sendTextUpdate = useCallback(
    (textId: number, data: TextUpdateMessage['data']) => {
      if (!isConnected) {
        return;
      }

      const destination = `/app/text/${textId}/roadmap/${roadmapId}/updated`;
      send(destination, { id: textId, data });
    },
    [isConnected, roadmapId, send],
  );

  return {
    isConnected,
    isSubscribed,
    sendTextUpdate,
  };
}
