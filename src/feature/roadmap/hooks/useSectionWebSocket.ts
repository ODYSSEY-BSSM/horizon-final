import { useCallback, useEffect, useState } from 'react';
import type { SectionDeleteMessage, SectionMessage, SectionUpdateMessage } from '@/shared/api';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';

export interface UseSectionWebSocketOptions {
  roadmapId: number;

  onCreated?: (section: SectionMessage['section']) => void;

  onUpdated?: (update: SectionUpdateMessage) => void;

  onDeleted?: (sectionId: number) => void;

  autoSubscribe?: boolean;
}

export function useSectionWebSocket(options: UseSectionWebSocketOptions) {
  const { roadmapId, onCreated, onUpdated, onDeleted, autoSubscribe = true } = options;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const { isConnected, subscribe, unsubscribe, send } = useStompWebSocket();

  const handleCreated = useCallback(
    (message: SectionMessage) => {
      onCreated?.(message.section);
    },
    [onCreated],
  );

  const handleUpdated = useCallback(
    (update: SectionUpdateMessage) => {
      onUpdated?.(update);
    },
    [onUpdated],
  );

  const handleDeleted = useCallback(
    (sectionId: SectionDeleteMessage) => {
      onDeleted?.(sectionId);
    },
    [onDeleted],
  );

  useEffect(() => {
    if (!isConnected || !autoSubscribe || !roadmapId) {
      return;
    }

    const createdTopic = `/topic/section/roadmap/${roadmapId}/created`;
    const updatedTopic = `/topic/section/roadmap/${roadmapId}/updated`;
    const deletedTopic = `/topic/section/roadmap/${roadmapId}/deleted`;

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

  const sendSectionUpdate = useCallback(
    (sectionId: number, data: SectionUpdateMessage['data']) => {
      if (!isConnected) {
        return;
      }

      const destination = `/app/section/${sectionId}/roadmap/${roadmapId}/updated`;
      send(destination, { id: sectionId, data });
    },
    [isConnected, roadmapId, send],
  );

  return {
    isConnected,
    isSubscribed,
    sendSectionUpdate,
  };
}
