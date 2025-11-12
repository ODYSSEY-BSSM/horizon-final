import type { Color, NodeType, Subject } from '@/shared/api/types';

// ===================================
// Node API Types (Swagger API)
// ===================================

// Node Create (노드 생성)
export interface NodeCreateRequest {
  title: string; // 0-64자
  description: string; // 0-1500자
  height: number; // int32
  width: number; // int32
  type: NodeType;
  x: number; // int32 - 위치
  y: number; // int32 - 위치
  color: Color;
  parentNodeId?: number; // 부모 노드 ID (선택)
}

// Education Node Convert (교육과정 노드 전환)
export interface EducationNodeConvertRequest {
  subject: Subject; // 교과목 (필수)
}

// Node Response (노드 응답)
export interface NodeResponse {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  color: string;
  roadmapId: number;
  parentNodeId?: number;
  childNode: NodeResponse[]; // 자식 노드 배열 (재귀 구조)
  progress: number; // int32
  isEducation: boolean; // 교육과정 노드 여부
  subject?: string; // 교과목 (교육과정 노드인 경우)
}

// Node Update (노드 수정)
export interface NodeUpdateRequest {
  title?: string;
  description?: string;
  height?: number;
  width?: number;
  type?: NodeType;
  x?: number;
  y?: number;
  color?: Color;
  parentNodeId?: number;
}

// Node List Response (노드 전체 조회)
export interface NodeListResponse {
  nodes: NodeResponse[];
}
