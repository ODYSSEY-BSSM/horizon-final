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
    }, 2000); // Check every 2 seconds to reduce CPU usage

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

  // Unsubscribe function
  const unsubscribe = useCallback((destination: string) => {
    clientRef.current.unsubscribe(destination);
  }, []);

  // Send function
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
