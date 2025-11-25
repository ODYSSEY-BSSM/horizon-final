import { useCallback, useEffect, useState } from 'react';
import type { RoadmapDeleteMessage, RoadmapMessage, RoadmapUpdateMessage } from '@/shared/api';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';

export interface UseTeamRoadmapWebSocketOptions {
  teamId: number;

  onCreated?: (roadmap: RoadmapMessage['roadmap']) => void;

  onUpdated?: (roadmap: RoadmapUpdateMessage['roadmap']) => void;

  onDeleted?: (roadmapId: number) => void;

  autoSubscribe?: boolean;
}

export function useTeamRoadmapWebSocket(options: UseTeamRoadmapWebSocketOptions) {
  const { teamId, onCreated, onUpdated, onDeleted, autoSubscribe = true } = options;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const { isConnected, subscribe, unsubscribe } = useStompWebSocket();

  const handleCreated = useCallback(
    (message: RoadmapMessage) => {
      onCreated?.(message.roadmap);
    },
    [onCreated],
  );

  const handleUpdated = useCallback(
    (message: RoadmapUpdateMessage) => {
      onUpdated?.(message.roadmap);
    },
    [onUpdated],
  );

  const handleDeleted = useCallback(
    (roadmapId: RoadmapDeleteMessage) => {
      onDeleted?.(roadmapId);
    },
    [onDeleted],
  );

  useEffect(() => {
    if (!isConnected || !autoSubscribe || !teamId) {
      return;
    }

    const createdTopic = `/topic/roadmap/team/${teamId}/created`;
    const updatedTopic = `/topic/roadmap/team/${teamId}/updated`;
    const deletedTopic = `/topic/roadmap/team/${teamId}/deleted`;

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
    teamId,
    subscribe,
    unsubscribe,
    handleCreated,
    handleUpdated,
    handleDeleted,
  ]);

  return {
    isConnected,
    isSubscribed,
  };
}
