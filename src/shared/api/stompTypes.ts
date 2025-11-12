// ===================================
// WebSocket Message Types
// ===================================

// 팀 디렉토리 메시지
export interface TeamDirectoryMessage {
  id: number;
  name: string;
  teamId: number;
  roadmaps: unknown[]; // 필요시 타입 정의
}

// 로드맵 노드 메시지
export type NodeType = 'TOP' | 'MIDDLE' | 'BOTTOM';
export type NodeCategory = 'develop' | string; // 필요시 카테고리 추가

export interface RoadmapNodeMessage {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: NodeCategory;
  roadmapId: number;
  parentNodeId: number | null;
  childNode: unknown[]; // 필요시 타입 정의
}

// 노드 수정 메시지
export interface NodeUpdateMessage {
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: NodeCategory;
  parentNodeId: number | null;
}

// 커서 위치 메시지 (전송)
export interface CursorSendMessage {
  x: number;
  y: number;
}

// 커서 위치 메시지 (수신)
export interface CursorReceiveMessage {
  userId: number;
  userName: string;
  x: number;
  y: number;
}

// 삭제 메시지 (ID만 반환)
export type DeleteMessage = number;
