import { Client, IFrame, IMessage, StompSubscription } from '@stomp/stompjs';
import { tokenStore } from '@/feature/auth';

// STOMP WebSocket configuration
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8080';
const WS_ENDPOINT = '/ws';

export type StompMessageHandler<T = unknown> = (message: T) => void;

/**
 * STOMP WebSocket Client
 * STOMP over WebSocket을 사용하여 실시간 통신을 제공합니다.
 */
export class StompWebSocketClient {
  private client: Client;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;

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

  /**
   * WebSocket 연결
   */
  connect(): void {
    if (this.isConnected || this.client.active) {
      console.warn('[STOMP] Already connected or connecting');
      return;
    }

    // Get JWT token for authentication
    const token = tokenStore.getAccessToken();
    if (!token) {
      console.error('[STOMP] No access token found');
      return;
    }

    // Set authorization header
    this.client.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };

    console.log('[STOMP] Connecting...');
    this.client.activate();
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    if (!this.client.active) {
      return;
    }

    console.log('[STOMP] Disconnecting...');

    // Unsubscribe all
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();

    // Deactivate client
    this.client.deactivate();
    this.isConnected = false;
  }

  /**
   * 토픽 구독
   * @param destination 구독할 토픽 경로 (예: /topic/directory/team/1/created)
   * @param handler 메시지 핸들러
   * @returns 구독 ID
   */
  subscribe<T>(destination: string, handler: StompMessageHandler<T>): string {
    if (!this.isConnected) {
      console.error('[STOMP] Cannot subscribe: not connected');
      throw new Error('Not connected to STOMP server');
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body) as T;
        handler(data);
      } catch (error) {
        console.error('[STOMP] Failed to parse message:', error);
      }
    });

    this.subscriptions.set(destination, subscription);
    console.log('[STOMP] Subscribed to:', destination);

    return subscription.id;
  }

  /**
   * 구독 해제
   * @param destination 구독 해제할 토픽 경로
   */
  unsubscribe(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log('[STOMP] Unsubscribed from:', destination);
    }
  }

  /**
   * 메시지 전송
   * @param destination 전송할 경로 (예: /app/roadmap/1/cursor)
   * @param body 메시지 내용
   */
  send<T>(destination: string, body: T): void {
    if (!this.isConnected) {
      console.error('[STOMP] Cannot send: not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });

    console.log('[STOMP] Sent message to:', destination);
  }

  /**
   * 연결 상태 확인
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  // ===================================
  // Private Methods
  // ===================================

  private onConnect(frame: IFrame): void {
    console.log('[STOMP] Connected:', frame);
    this.isConnected = true;
    this.reconnectAttempts = 0;
  }

  private onDisconnect(frame: IFrame): void {
    console.log('[STOMP] Disconnected:', frame);
    this.isConnected = false;
    this.subscriptions.clear();

    // Auto-reconnect
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `[STOMP] Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('[STOMP] Max reconnect attempts reached');
    }
  }

  private onError(frame: IFrame): void {
    console.error('[STOMP] Error:', frame);
  }
}

// ===================================
// Singleton Instance
// ===================================

let stompClient: StompWebSocketClient | null = null;

/**
 * STOMP WebSocket 클라이언트 인스턴스 가져오기
 */
export function getStompClient(): StompWebSocketClient {
  if (!stompClient) {
    stompClient = new StompWebSocketClient();
  }
  return stompClient;
}

/**
 * STOMP WebSocket 연결 해제 및 인스턴스 제거
 */
export function destroyStompClient(): void {
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
  }
}
