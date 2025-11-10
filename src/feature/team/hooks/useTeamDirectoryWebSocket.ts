import { useEffect, useState, useCallback } from 'react';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';
import type { TeamDirectoryMessage, DeleteMessage } from '@/shared/api/stompTypes';

export interface UseTeamDirectoryWebSocketOptions {
  teamId: number;
  onCreated?: (directory: TeamDirectoryMessage) => void;
  onUpdated?: (directory: TeamDirectoryMessage) => void;
  onDeleted?: (directoryId: number) => void;
  autoSubscribe?: boolean;
}

export function useTeamDirectoryWebSocket(options: UseTeamDirectoryWebSocketOptions) {
  const { teamId, onCreated, onUpdated, onDeleted, autoSubscribe = true } = options;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const { isConnected, subscribe, unsubscribe } = useStompWebSocket();

  const handleCreated = useCallback(
    (message: TeamDirectoryMessage) => {
      onCreated?.(message);
    },
    [onCreated],
  );

  const handleUpdated = useCallback(
    (message: TeamDirectoryMessage) => {
      onUpdated?.(message);
    },
    [onUpdated],
  );

  const handleDeleted = useCallback(
    (directoryId: DeleteMessage) => {
      onDeleted?.(directoryId);
    },
    [onDeleted],
  );

  useEffect(() => {
    if (!isConnected || !autoSubscribe || !teamId) {
      return;
    }

    const createdTopic = `/topic/directory/team/${teamId}/created`;
    const updatedTopic = `/topic/directory/team/${teamId}/updated`;
    const deletedTopic = `/topic/directory/team/${teamId}/deleted`;

    // Subscribe to topics
    subscribe(createdTopic, handleCreated);
    subscribe(updatedTopic, handleUpdated);
    subscribe(deletedTopic, handleDeleted);

    setIsSubscribed(true);

    // Cleanup
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
