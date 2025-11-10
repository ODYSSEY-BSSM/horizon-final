export { apiClient } from './client';
export { ApiError } from './errors';
export type { ApiErrorResponse, ApiResponse, PaginatedResponse } from './types';
export {
  ApplyStatus,
  Color,
  Icon,
  NodeType,
  ProblemStatus,
  Subject,
  UserRole,
  ColorHexMap,
  IconMap,
} from './types';

// STOMP WebSocket
export { getStompClient, destroyStompClient, StompWebSocketClient } from './stompWebSocket';
export type { StompMessageHandler } from './stompWebSocket';
export type {
  TeamDirectoryMessage,
  RoadmapNodeMessage,
  NodeUpdateMessage,
  CursorSendMessage,
  CursorReceiveMessage,
  DeleteMessage,
  NodeType as WsNodeType,
  NodeCategory,
} from './stompTypes';

// Legacy WebSocket (deprecated - use STOMP instead)
export {
  getWebSocketClient,
  removeWebSocketClient,
  disconnectAllWebSockets,
  WebSocketClient,
} from './websocket';
export type { WebSocketMessage, WebSocketEventType } from './websocket';
