import type { IMessage } from '@stomp/stompjs';
import { useEffect } from 'react';
import { stompClient } from '@/shared/lib/stomp';
import { useWebSocketStore } from '@/shared/store/websocketStore';

export const useStomp = (topic: string | null, callback: (message: IMessage) => void) => {
  const { setStatus } = useWebSocketStore();

  useEffect(() => {
    if (!topic) {
      return;
    }

    stompClient.onConnect = () => {
      setStatus('CONNECTED');
      stompClient.subscribe(topic, callback);
    };

    stompClient.onStompError = (frame) => {
      console.error(`Broker reported error: ${frame.headers.message}`);
      console.error(`Additional details: ${frame.body}`);
      setStatus('DISCONNECTED');
    };

    stompClient.onWebSocketClose = () => {
      setStatus('DISCONNECTED');
    };

    setStatus('CONNECTING');
    stompClient.activate();

    return () => {
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, [topic, callback, setStatus]);

  const publish = (destination: string, body: string) => {
    if (stompClient.connected) {
      stompClient.publish({ destination, body });
    } else {
      console.error('STOMP client is not connected.');
    }
  };

  return { publish };
};
