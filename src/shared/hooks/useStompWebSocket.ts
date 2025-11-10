import { useEffect, useRef, useState, useCallback } from 'react';
import { getStompClient, type StompMessageHandler } from '@/shared/api/stompWebSocket';

export interface UseStompWebSocketOptions {
  /**
   * 자동으로 연결할지 여부 (기본값: true)
   */
  autoConnect?: boolean;

  /**
   * 연결 성공 콜백
   */
  onConnect?: () => void;

  /**
   * 연결 해제 콜백
   */
  onDisconnect?: () => void;

  /**
   * 에러 콜백
   */
  onError?: (error: Error) => void;
}

export interface UseStompWebSocketReturn {
  /**
   * 연결 상태
   */
  isConnected: boolean;

  /**
   * 수동 연결
   */
  connect: () => void;

  /**
   * 연결 해제
   */
  disconnect: () => void;

  /**
   * 토픽 구독
   */
  subscribe: <T>(destination: string, handler: StompMessageHandler<T>) => string | null;

  /**
   * 구독 해제
   */
  unsubscribe: (destination: string) => void;

  /**
   * 메시지 전송
   */
  send: <T>(destination: string, body: T) => void;
}

/**
 * STOMP WebSocket Hook
 *
 * @param options 옵션
 * @returns STOMP WebSocket 상태 및 제어 함수
 *
 * @example
 * ```tsx
 * const { isConnected, subscribe, unsubscribe, send } = useStompWebSocket({
 *   onConnect: () => console.log('Connected'),
 * });
 *
 * useEffect(() => {
 *   if (isConnected) {
 *     const subId = subscribe('/topic/test', (message) => {
 *       console.log('Message:', message);
 *     });
 *
 *     return () => {
 *       if (subId) unsubscribe('/topic/test');
 *     };
 *   }
 * }, [isConnected, subscribe, unsubscribe]);
 * ```
 */
export function useStompWebSocket(
  options: UseStompWebSocketOptions = {},
): UseStompWebSocketReturn {
  const { autoConnect = true, onConnect, onDisconnect, onError } = options;

  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(getStompClient());
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check connection status periodically
  useEffect(() => {
    checkIntervalRef.current = setInterval(() => {
      const connected = clientRef.current.getIsConnected();
      setIsConnected((prev) => {
        if (prev !== connected) {
          if (connected) {
            onConnect?.();
          } else {
            onDisconnect?.();
          }
        }
        return connected;
      });
    }, 500);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [onConnect, onDisconnect]);

  // Auto connect
  useEffect(() => {
    if (autoConnect && !isConnected) {
      try {
        clientRef.current.connect();
      } catch (error) {
        onError?.(error as Error);
      }
    }
  }, [autoConnect, isConnected, onError]);

  // Connect function
  const connect = useCallback(() => {
    try {
      clientRef.current.connect();
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onError]);

  // Disconnect function
  const disconnect = useCallback(() => {
    clientRef.current.disconnect();
  }, []);

  // Subscribe function
  const subscribe = useCallback(
    <T,>(destination: string, handler: StompMessageHandler<T>) => {
      if (!isConnected) {
        console.warn('[useStompWebSocket] Cannot subscribe: not connected');
        return null;
      }

      try {
        return clientRef.current.subscribe(destination, handler);
      } catch (error) {
        onError?.(error as Error);
        return null;
      }
    },
    [isConnected, onError],
  );

  // Unsubscribe function
  const unsubscribe = useCallback((destination: string) => {
    clientRef.current.unsubscribe(destination);
  }, []);

  // Send function
  const send = useCallback(
    <T,>(destination: string, body: T) => {
      if (!isConnected) {
        console.warn('[useStompWebSocket] Cannot send: not connected');
        return;
      }

      try {
        clientRef.current.send(destination, body);
      } catch (error) {
        onError?.(error as Error);
      }
    },
    [isConnected, onError],
  );

  return {
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
  };
}
