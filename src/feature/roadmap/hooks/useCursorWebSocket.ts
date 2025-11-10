import { useEffect, useState, useCallback } from 'react';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';
import type { CursorSendMessage, CursorReceiveMessage } from '@/shared/api/stompTypes';

export interface UseCursorWebSocketOptions {
  /**
   * 로드맵 ID
   */
  roadmapId: number;

  /**
   * 커서 위치 수신 콜백
   */
  onCursorMove?: (cursor: CursorReceiveMessage) => void;

  /**
   * 자동 구독 여부 (기본값: true)
   */
  autoSubscribe?: boolean;
}

export interface CursorPosition {
  x: number;
  y: number;
}

/**
 * 커서 위치 실시간 구독 Hook
 *
 * 다른 사용자의 커서 위치를 실시간으로 받고, 자신의 커서 위치를 브로드캐스팅합니다.
 *
 * @example
 * ```tsx
 * const { isSubscribed, sendCursorPosition, otherCursors } = useCursorWebSocket({
 *   roadmapId: 1,
 *   onCursorMove: (cursor) => {
 *     console.log(`User ${cursor.userName} moved to (${cursor.x}, ${cursor.y})`);
 *   },
 * });
 *
 * // 마우스 이동 시
 * const handleMouseMove = (e: MouseEvent) => {
 *   sendCursorPosition({ x: e.clientX, y: e.clientY });
 * };
 * ```
 */
export function useCursorWebSocket(options: UseCursorWebSocketOptions) {
  const { roadmapId, onCursorMove, autoSubscribe = true } = options;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [otherCursors, setOtherCursors] = useState<Map<number, CursorReceiveMessage>>(new Map());
  const { isConnected, subscribe, unsubscribe, send } = useStompWebSocket();

  const handleCursorMove = useCallback(
    (cursor: CursorReceiveMessage) => {
      // Update other cursors map
      setOtherCursors((prev) => {
        const next = new Map(prev);
        next.set(cursor.userId, cursor);
        return next;
      });

      // Call user callback
      onCursorMove?.(cursor);
    },
    [onCursorMove],
  );

  // Subscribe to cursor topic
  useEffect(() => {
    if (!isConnected || !autoSubscribe || !roadmapId) {
      return;
    }

    const cursorTopic = `/topic/roadmap/${roadmapId}/cursor`;
    subscribe(cursorTopic, handleCursorMove);

    setIsSubscribed(true);

    return () => {
      unsubscribe(cursorTopic);
      setIsSubscribed(false);
      setOtherCursors(new Map());
    };
  }, [isConnected, autoSubscribe, roadmapId, subscribe, unsubscribe, handleCursorMove]);

  /**
   * 커서 위치 전송
   */
  const sendCursorPosition = useCallback(
    (position: CursorPosition) => {
      if (!isConnected) {
        return;
      }

      const destination = `/app/roadmap/${roadmapId}/cursor`;
      const message: CursorSendMessage = {
        x: position.x,
        y: position.y,
      };

      send(destination, message);
    },
    [isConnected, roadmapId, send],
  );

  /**
   * 특정 사용자의 커서 제거 (타임아웃 등)
   */
  const removeCursor = useCallback((userId: number) => {
    setOtherCursors((prev) => {
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  }, []);

  return {
    isConnected,
    isSubscribed,
    otherCursors: Array.from(otherCursors.values()),
    sendCursorPosition,
    removeCursor,
  };
}
