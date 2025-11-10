import { useEffect, useState, useCallback } from 'react';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';
import type { TeamDirectoryMessage, DeleteMessage } from '@/shared/api/stompTypes';

export interface UseTeamDirectoryWebSocketOptions {
  /**
   * 팀 ID
   */
  teamId: number;

  /**
   * 디렉토리 생성 콜백
   */
  onCreated?: (directory: TeamDirectoryMessage) => void;

  /**
   * 디렉토리 수정 콜백
   */
  onUpdated?: (directory: TeamDirectoryMessage) => void;

  /**
   * 디렉토리 삭제 콜백
   */
  onDeleted?: (directoryId: number) => void;

  /**
   * 자동 구독 여부 (기본값: true)
   */
  autoSubscribe?: boolean;
}

/**
 * 팀 디렉토리 실시간 구독 Hook
 *
 * 팀의 디렉토리 변경사항을 실시간으로 받습니다.
 *
 * @example
 * ```tsx
 * const { isSubscribed } = useTeamDirectoryWebSocket({
 *   teamId: 1,
 *   onCreated: (directory) => {
 *     console.log('New directory:', directory);
 *     // React Query 캐시 무효화 등
 *   },
 *   onDeleted: (directoryId) => {
 *     console.log('Deleted directory:', directoryId);
 *   },
 * });
 * ```
 */
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
