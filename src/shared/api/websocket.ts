import { tokenStore } from '@/feature/auth';

// WebSocket configuration
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8080';
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const RECONNECT_DELAY = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

export type WebSocketEventType = 'open' | 'close' | 'error' | 'message';

export interface WebSocketMessage<T = unknown> {
  type: string;
  data: T;
  timestamp: string;
}

type MessageHandler = (data: WebSocketMessage) => void;
type EventHandler = (event: Event) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private eventHandlers: Map<WebSocketEventType, EventHandler[]> = new Map();
  private isManualClose: boolean = false;
  private isConnecting: boolean = false;

  constructor(endpoint: string) {
    this.url = `${WS_BASE_URL}${endpoint}`;
  }

  /**
   * WebSocket 연결
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.warn('[WebSocket] Already connected or connecting');
      return;
    }

    this.isConnecting = true;
    this.isManualClose = false;

    try {
      // Get access token for authentication
      const token = tokenStore.getAccessToken();
      const wsUrl = token ? `${this.url}?token=${token}` : this.url;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    this.isManualClose = true;
    this.clearReconnectTimeout();
    this.clearHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnecting = false;
  }

  /**
   * 메시지 전송
   */
  send<T>(type: string, data: T): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('[WebSocket] Cannot send message: WebSocket is not open');
      return;
    }

    const message: WebSocketMessage<T> = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * 특정 메시지 타입에 대한 핸들러 등록
   */
  on(messageType: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(messageType) || [];
    handlers.push(handler);
    this.messageHandlers.set(messageType, handlers);
  }

  /**
   * 메시지 핸들러 제거
   */
  off(messageType: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const filtered = handlers.filter((h) => h !== handler);
      if (filtered.length > 0) {
        this.messageHandlers.set(messageType, filtered);
      } else {
        this.messageHandlers.delete(messageType);
      }
    }
  }

  /**
   * WebSocket 이벤트 핸들러 등록
   */
  addEventListener(event: WebSocketEventType, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.push(handler);
    this.eventHandlers.set(event, handlers);
  }

  /**
   * WebSocket 이벤트 핸들러 제거
   */
  removeEventListener(event: WebSocketEventType, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const filtered = handlers.filter((h) => h !== handler);
      if (filtered.length > 0) {
        this.eventHandlers.set(event, filtered);
      } else {
        this.eventHandlers.delete(event);
      }
    }
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 연결 상태 반환
   */
  getReadyState(): number | null {
    return this.ws?.readyState ?? null;
  }

  // ===================================
  // Private Methods
  // ===================================

  private handleOpen(event: Event): void {
    console.log('[WebSocket] Connected');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.startHeartbeat();

    // Trigger open event handlers
    this.triggerEventHandlers('open', event);
  }

  private handleClose(event: CloseEvent): void {
    console.log('[WebSocket] Disconnected', event.code, event.reason);
    this.isConnecting = false;
    this.clearHeartbeat();

    // Trigger close event handlers
    this.triggerEventHandlers('close', event);

    // Auto-reconnect if not manual close
    if (!this.isManualClose) {
      this.scheduleReconnect();
    }
  }

  private handleError(event: Event): void {
    console.error('[WebSocket] Error:', event);
    this.isConnecting = false;

    // Trigger error event handlers
    this.triggerEventHandlers('error', event);
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // Trigger message event handlers
      this.triggerEventHandlers('message', event);

      // Trigger specific message type handlers
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach((handler) => handler(message));
      }
    } catch (error) {
      console.error('[WebSocket] Failed to parse message:', error);
    }
  }

  private triggerEventHandlers(event: WebSocketEventType, data: Event): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WebSocket] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `[WebSocket] Reconnecting... (${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, RECONNECT_DELAY);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private startHeartbeat(): void {
    this.clearHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, HEARTBEAT_INTERVAL);
  }

  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

// ===================================
// WebSocket Factory
// ===================================

const wsClients: Map<string, WebSocketClient> = new Map();

/**
 * WebSocket 클라이언트 인스턴스 생성 또는 가져오기
 */
export function getWebSocketClient(endpoint: string): WebSocketClient {
  if (!wsClients.has(endpoint)) {
    wsClients.set(endpoint, new WebSocketClient(endpoint));
  }
  return wsClients.get(endpoint)!;
}

/**
 * WebSocket 클라이언트 제거
 */
export function removeWebSocketClient(endpoint: string): void {
  const client = wsClients.get(endpoint);
  if (client) {
    client.disconnect();
    wsClients.delete(endpoint);
  }
}

/**
 * 모든 WebSocket 연결 해제
 */
export function disconnectAllWebSockets(): void {
  wsClients.forEach((client) => client.disconnect());
  wsClients.clear();
}
