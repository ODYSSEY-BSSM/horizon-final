import { useEffect, useState, useCallback } from 'react';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';
import type {
  RoadmapNodeMessage,
  NodeUpdateMessage,
  DeleteMessage,
} from '@/shared/api/stompTypes';

export interface UseRoadmapNodesWebSocketOptions {
  /**
   * 로드맵 ID
   */
  roadmapId: number;

  /**
   * 노드 생성 콜백
   */
  onCreated?: (node: RoadmapNodeMessage) => void;

  /**
   * 노드 수정 콜백
   */
  onUpdated?: (nodeId: number, updates: NodeUpdateMessage) => void;

  /**
   * 노드 삭제 콜백
   */
  onDeleted?: (nodeId: number) => void;

  /**
   * 자동 구독 여부 (기본값: true)
   */
  autoSubscribe?: boolean;
}

/**
 * 로드맵 노드 실시간 구독 Hook
 *
 * 특정 로드맵의 노드 변경사항을 실시간으로 받습니다.
 *
 * @example
 * ```tsx
 * const { isSubscribed, sendNodeUpdate } = useRoadmapNodesWebSocket({
 *   roadmapId: 1,
 *   onCreated: (node) => {
 *     console.log('New node:', node);
 *     queryClient.invalidateQueries(['nodes', 1]);
 *   },
 *   onUpdated: (nodeId, updates) => {
 *     console.log('Updated node:', nodeId, updates);
 *   },
 * });
 * ```
 */
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

  const handleDeleted = useCallback(
    (nodeId: DeleteMessage) => {
      onDeleted?.(nodeId);
    },
    [onDeleted],
  );

  // Subscribe to node creation and deletion
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

  /**
   * 특정 노드의 수정사항 구독
   */
  const subscribeNodeUpdate = useCallback(
    (nodeId: number, handler: (updates: NodeUpdateMessage) => void) => {
      if (!isConnected) {
        console.warn('[useRoadmapNodesWebSocket] Cannot subscribe: not connected');
        return;
      }

      const updateTopic = `/topic/roadmap/${roadmapId}/nodes/${nodeId}`;
      subscribe(updateTopic, handler);
    },
    [isConnected, roadmapId, subscribe],
  );

  /**
   * 특정 노드의 수정사항 구독 해제
   */
  const unsubscribeNodeUpdate = useCallback(
    (nodeId: number) => {
      const updateTopic = `/topic/roadmap/${roadmapId}/nodes/${nodeId}`;
      unsubscribe(updateTopic);
    },
    [roadmapId, unsubscribe],
  );

  /**
   * 노드 수정 메시지 전송
   */
  const sendNodeUpdate = useCallback(
    (nodeId: number, updates: NodeUpdateMessage) => {
      if (!isConnected) {
        console.warn('[useRoadmapNodesWebSocket] Cannot send: not connected');
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
