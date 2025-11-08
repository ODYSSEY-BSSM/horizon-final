import { Client } from '@stomp/stompjs';
import { useAuthStore } from '@/features/auth/store/authStore';

const createStompClient = () => {
  const accessToken = useAuthStore.getState().accessToken;

  const client = new Client({
    brokerURL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  return client;
};

export const stompClient = createStompClient();

export const connect = () => {
  if (!stompClient.connected) {
    stompClient.activate();
  }
};

export const disconnect = () => {
  if (stompClient.connected) {
    stompClient.deactivate();
  }
};
