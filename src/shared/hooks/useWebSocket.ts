import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getWebSocketClient,
  removeWebSocketClient,
  type WebSocketClient,
  type WebSocketMessage,
} from '@/shared/api/websocket';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  autoDisconnect?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export interface UseWebSocketReturn {
  client: WebSocketClient | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  send: <T>(type: string, data: T) => void;
  subscribe: (messageType: string, handler: (data: WebSocketMessage) => void) => void;
  unsubscribe: (messageType: string, handler: (data: WebSocketMessage) => void) => void;
}

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

  useEffect(() => {
    handlersRef.current = { onOpen, onClose, onError, onMessage };
  }, [onOpen, onClose, onError, onMessage]);

  useEffect(() => {
    const client = getWebSocketClient(endpoint);
    clientRef.current = client;

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
      } catch (_error) {
        // 메시지 파싱에 실패한 경우 무시
      }
    };

    client.addEventListener('open', handleOpen);
    client.addEventListener('close', handleClose);
    client.addEventListener('error', handleError);
    client.addEventListener('message', handleMessage);

    if (autoConnect) {
      setIsConnecting(true);
      client.connect();
    }

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

  const connect = useCallback(() => {
    if (clientRef.current) {
      setIsConnecting(true);
      clientRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  const send = useCallback(<T>(type: string, data: T) => {
    if (clientRef.current?.isConnected()) {
      clientRef.current.send(type, data);
    }
  }, []);

  const subscribe = useCallback(
    (messageType: string, handler: (data: WebSocketMessage) => void) => {
      if (clientRef.current) {
        clientRef.current.on(messageType, handler);
      }
    },
    [],
  );

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
