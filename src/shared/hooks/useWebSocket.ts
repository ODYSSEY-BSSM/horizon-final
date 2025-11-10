import { useEffect, useRef, useState, useCallback } from 'react';
import {
  getWebSocketClient,
  removeWebSocketClient,
  type WebSocketClient,
  type WebSocketMessage,
} from '@/shared/api/websocket';

export interface UseWebSocketOptions {
  /**
   * 자동으로 연결할지 여부 (기본값: true)
   */
  autoConnect?: boolean;

  /**
   * 컴포넌트 언마운트 시 연결 해제할지 여부 (기본값: true)
   */
  autoDisconnect?: boolean;

  /**
   * 연결 성공 콜백
   */
  onOpen?: () => void;

  /**
   * 연결 해제 콜백
   */
  onClose?: () => void;

  /**
   * 에러 콜백
   */
  onError?: (error: Event) => void;

  /**
   * 메시지 수신 콜백 (모든 메시지)
   */
  onMessage?: (message: WebSocketMessage) => void;
}

export interface UseWebSocketReturn {
  /**
   * WebSocket 클라이언트 인스턴스
   */
  client: WebSocketClient | null;

  /**
   * 연결 상태
   */
  isConnected: boolean;

  /**
   * 연결 중 상태
   */
  isConnecting: boolean;

  /**
   * 수동 연결
   */
  connect: () => void;

  /**
   * 연결 해제
   */
  disconnect: () => void;

  /**
   * 메시지 전송
   */
  send: <T>(type: string, data: T) => void;

  /**
   * 메시지 핸들러 등록
   */
  subscribe: (messageType: string, handler: (data: WebSocketMessage) => void) => void;

  /**
   * 메시지 핸들러 제거
   */
  unsubscribe: (messageType: string, handler: (data: WebSocketMessage) => void) => void;
}

/**
 * WebSocket Hook
 *
 * @param endpoint WebSocket 엔드포인트 (예: '/ws/notifications')
 * @param options 옵션
 * @returns WebSocket 상태 및 제어 함수
 *
 * @example
 * ```tsx
 * const { isConnected, send, subscribe, unsubscribe } = useWebSocket('/ws/notifications', {
 *   onOpen: () => console.log('Connected'),
 *   onMessage: (message) => console.log('Message:', message),
 * });
 *
 * useEffect(() => {
 *   const handler = (message) => {
 *     console.log('Notification:', message.data);
 *   };
 *
 *   subscribe('notification', handler);
 *   return () => unsubscribe('notification', handler);
 * }, [subscribe, unsubscribe]);
 *
 * const handleSend = () => {
 *   send('chat', { text: 'Hello!' });
 * };
 * ```
 */
export function useWebSocket(
  endpoint: string,
  options: UseWebSocketOptions = {},
): UseWebSocketReturn {
  const {
    autoConnect = true,
    autoDisconnect = true,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const clientRef = useRef<WebSocketClient | null>(null);
  const handlersRef = useRef<{
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
    onMessage?: (message: WebSocketMessage) => void;
  }>({});

  // Update handlers ref when callbacks change
  useEffect(() => {
    handlersRef.current = { onOpen, onClose, onError, onMessage };
  }, [onOpen, onClose, onError, onMessage]);

  // Initialize WebSocket client
  useEffect(() => {
    const client = getWebSocketClient(endpoint);
    clientRef.current = client;

    // Setup event handlers
    const handleOpen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      handlersRef.current.onOpen?.();
    };

    const handleClose = () => {
      setIsConnected(false);
      setIsConnecting(false);
      handlersRef.current.onClose?.();
    };

    const handleError = (event: Event) => {
      setIsConnecting(false);
      handlersRef.current.onError?.(event);
    };

    const handleMessage = (event: Event) => {
      try {
        const message: WebSocketMessage = JSON.parse((event as MessageEvent).data);
        handlersRef.current.onMessage?.(message);
      } catch (error) {
        console.error('[useWebSocket] Failed to parse message:', error);
      }
    };

    client.addEventListener('open', handleOpen);
    client.addEventListener('close', handleClose);
    client.addEventListener('error', handleError);
    client.addEventListener('message', handleMessage);

    // Auto connect
    if (autoConnect) {
      setIsConnecting(true);
      client.connect();
    }

    // Cleanup
    return () => {
      client.removeEventListener('open', handleOpen);
      client.removeEventListener('close', handleClose);
      client.removeEventListener('error', handleError);
      client.removeEventListener('message', handleMessage);

      if (autoDisconnect) {
        removeWebSocketClient(endpoint);
      }
    };
  }, [endpoint, autoConnect, autoDisconnect]);

  // Connect function
  const connect = useCallback(() => {
    if (clientRef.current) {
      setIsConnecting(true);
      clientRef.current.connect();
    }
  }, []);

  // Disconnect function
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  // Send function
  const send = useCallback(<T,>(type: string, data: T) => {
    if (clientRef.current?.isConnected()) {
      clientRef.current.send(type, data);
    } else {
      console.warn('[useWebSocket] Cannot send message: WebSocket is not connected');
    }
  }, []);

  // Subscribe function
  const subscribe = useCallback(
    (messageType: string, handler: (data: WebSocketMessage) => void) => {
      if (clientRef.current) {
        clientRef.current.on(messageType, handler);
      }
    },
    [],
  );

  // Unsubscribe function
  const unsubscribe = useCallback(
    (messageType: string, handler: (data: WebSocketMessage) => void) => {
      if (clientRef.current) {
        clientRef.current.off(messageType, handler);
      }
    },
    [],
  );

  return {
    client: clientRef.current,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
  };
}
