import { useCallback, useEffect, useRef, useState } from 'react';
import { getStompClient, type StompMessageHandler } from '@/shared/api/stompWebSocket';

export interface UseStompWebSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export interface UseStompWebSocketReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: <T>(destination: string, handler: StompMessageHandler<T>) => string | null;
  unsubscribe: (destination: string) => void;
  send: <T>(destination: string, body: T) => void;
}

export function useStompWebSocket(options: UseStompWebSocketOptions = {}): UseStompWebSocketReturn {
  const { autoConnect = true, onConnect, onDisconnect, onError } = options;

  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(getStompClient());

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      onConnect?.();
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      onDisconnect?.();
    };

    const handleError = (error?: unknown) => {
      onError?.(error instanceof Error ? error : new Error('WebSocket error'));
    };

    clientRef.current.addEventListener('connect', handleConnect);
    clientRef.current.addEventListener('disconnect', handleDisconnect);
    clientRef.current.addEventListener('error', handleError);

    setIsConnected(clientRef.current.getIsConnected());

    return () => {
      clientRef.current.removeEventListener('connect', handleConnect);
      clientRef.current.removeEventListener('disconnect', handleDisconnect);
      clientRef.current.removeEventListener('error', handleError);
    };
  }, [onConnect, onDisconnect, onError]);

  useEffect(() => {
    if (autoConnect && !isConnected) {
      try {
        clientRef.current.connect();
      } catch (error) {
        onError?.(error as Error);
      }
    }
  }, [autoConnect, isConnected, onError]);

  const connect = useCallback(() => {
    try {
      clientRef.current.connect();
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onError]);

  const disconnect = useCallback(() => {
    clientRef.current.disconnect();
  }, []);

  const subscribe = useCallback(
    <T>(destination: string, handler: StompMessageHandler<T>) => {
      if (!isConnected) {
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

  const unsubscribe = useCallback((destination: string) => {
    clientRef.current.unsubscribe(destination);
  }, []);

  const send = useCallback(
    <T>(destination: string, body: T) => {
      if (!isConnected) {
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
