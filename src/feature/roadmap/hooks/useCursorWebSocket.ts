import { useEffect, useState, useCallback } from 'react';
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';
import type { CursorSendMessage, CursorReceiveMessage } from '@/shared/api/stompTypes';

export interface UseCursorWebSocketOptions {
    roadmapId: number;

    onCursorMove?: (cursor: CursorReceiveMessage) => void;

    autoSubscribe?: boolean;
}

export interface CursorPosition {
  x: number;
  y: number;
}

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
