import { Client, type IFrame, type IMessage, type StompSubscription } from '@stomp/stompjs';
import { tokenStore } from '@/feature/auth';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8080';
const WS_ENDPOINT = '/ws';

export type StompMessageHandler<T = unknown> = (message: T) => void;
export type StompEventHandler = (error?: unknown) => void;
export type StompEventType = 'connect' | 'disconnect' | 'error';

export class StompWebSocketClient {
  private client: Client;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private eventListeners: Map<StompEventType, Set<StompEventHandler>> = new Map();
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

    this.client.onConnect = this.onConnect.bind(this);
    this.client.onDisconnect = this.onDisconnect.bind(this);
    this.client.onStompError = this.onError.bind(this);
  }

  connect(): void {
    if (this.isConnected || this.client.active) {
      return;
    }

    const token = tokenStore.getAccessToken();
    if (!token) {
      return;
    }

    this.client.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };
    this.client.activate();
  }

  disconnect(): void {
    if (!this.client.active) {
      return;
    }

    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();

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
      } catch (_error) {
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

  addEventListener(event: StompEventType, handler: StompEventHandler): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(handler);
  }

  removeEventListener(event: StompEventType, handler: StompEventHandler): void {
    this.eventListeners.get(event)?.delete(handler);
  }

  private emitEvent(event: StompEventType, payload?: unknown): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(payload);
      }
    }
  }

  private onConnect(_frame: IFrame): void {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.emitEvent('connect');
  }

  private onDisconnect(_frame: IFrame): void {
    this.isConnected = false;
    this.subscriptions.clear();
    this.emitEvent('disconnect');

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
    }
  }

  private onError(frame: IFrame): void {
    this.emitEvent('error', new Error(frame.body || 'STOMP error'));
  }
}

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
