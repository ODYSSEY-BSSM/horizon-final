// ===================================
// WebSocket Message Types
// ===================================

// 로드맵 요약 정보 (WebSocket 메시지에서 사용)
export interface RoadmapSummary {
  id: number;
  name: string;
  color?: string;
  icon?: string;
  status?: 'in-progress' | 'completed';
  progress?: number;
}

// 팀 디렉토리 메시지
export interface TeamDirectoryMessage {
  id: number;
  name: string;
  teamId: number;
  roadmaps: RoadmapSummary[];
}

// 로드맵 노드 메시지
export type NodeType = 'TOP' | 'MIDDLE' | 'BOTTOM';
export type NodeCategory = 'develop' | string; // 필요시 카테고리 추가

// 노드 자식 정보 (간단한 요약)
export interface NodeChild {
  id: number;
  title: string;
  type: NodeType;
  x: number;
  y: number;
}

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
  childNode: NodeChild[];
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
