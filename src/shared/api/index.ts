export { apiClient } from './client';
export { ApiError } from './errors';
export type {
  CursorReceiveMessage,
  CursorSendMessage,
  DeleteMessage,
  NodeCategory,
  NodeType as WsNodeType,
  NodeUpdateMessage,
  RoadmapNodeMessage,
  TeamDirectoryMessage,
} from './stompTypes';
export type { StompMessageHandler } from './stompWebSocket';

// STOMP WebSocket
export { destroyStompClient, getStompClient, StompWebSocketClient } from './stompWebSocket';
export type { ApiErrorResponse, ApiResponse, PaginatedResponse } from './types';
export {
  Color,
  ColorHexMap,
  Icon,
  IconMap,
  NodeType,
  ProblemStatus,
  Subject,
  UserRole,
} from './types';
export type { WebSocketEventType, WebSocketMessage } from './websocket';
// Legacy WebSocket (deprecated - use STOMP instead)
export {
  disconnectAllWebSockets,
  getWebSocketClient,
  removeWebSocketClient,
  WebSocketClient,
} from './websocket';
