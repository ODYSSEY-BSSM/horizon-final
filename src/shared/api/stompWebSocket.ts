import { Client, type IFrame, type IMessage, type StompSubscription } from '@stomp/stompjs';
import { tokenStore } from '@/feature/auth';

// STOMP WebSocket configuration
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8080';
const WS_ENDPOINT = '/ws';

export type StompMessageHandler<T = unknown> = (message: T) => void;

export class StompWebSocketClient {
  private client: Client;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor() {
    this.client = new Client({
      brokerURL: `${WS_BASE_URL}${WS_ENDPOINT}`,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    // Setup callbacks
    this.client.onConnect = this.onConnect.bind(this);
    this.client.onDisconnect = this.onDisconnect.bind(this);
    this.client.onStompError = this.onError.bind(this);
  }

  connect(): void {
    if (this.isConnected || this.client.active) {
      return;
    }

    // Get JWT token for authentication
    const token = tokenStore.getAccessToken();
    if (!token) {
      return;
    }

    // Set authorization header
    this.client.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };
    this.client.activate();
  }

  disconnect(): void {
    if (!this.client.active) {
      return;
    }

    // Unsubscribe all
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();

    // Deactivate client
    this.client.deactivate();
    this.isConnected = false;
  }

  subscribe<T>(destination: string, handler: StompMessageHandler<T>): string {
    if (!this.isConnected) {
      throw new Error('Not connected to STOMP server');
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body) as T;
        handler(data);
      } catch (error) {
        console.error(
          `[StompWebSocket] Failed to parse message from ${destination}:`,
          error,
          '\nMessage body:',
          message.body,
        );
      }
    });

    this.subscriptions.set(destination, subscription);

    return subscription.id;
  }

  unsubscribe(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  send<T>(destination: string, body: T): void {
    if (!this.isConnected) {
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  // ===================================
  // Private Methods
  // ===================================

  private onConnect(frame: IFrame): void {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    console.log('[StompWebSocket] Connected successfully', frame.command);
  }

  private onDisconnect(frame: IFrame): void {
    this.isConnected = false;
    this.subscriptions.clear();
    console.log('[StompWebSocket] Disconnected', frame.command);

    // Auto-reconnect
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `[StompWebSocket] Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.warn('[StompWebSocket] Max reconnect attempts reached. Giving up.');
    }
  }

  private onError(frame: IFrame): void {
    console.error('[StompWebSocket] Error occurred:', frame.headers, frame.body);
  }
}

// ===================================
// Singleton Instance
// ===================================

let stompClient: StompWebSocketClient | null = null;

export function getStompClient(): StompWebSocketClient {
  if (!stompClient) {
    stompClient = new StompWebSocketClient();
  }
  return stompClient;
}

export function destroyStompClient(): void {
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
  }
}
