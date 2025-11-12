import type { Color, Icon, NodeType, Subject } from '@/shared/api/types';

// ===================================
// Node API Types
// ===================================

// Node Create (노드 생성)
export interface NodeCreateRequest {
  name: string;
  description?: string;
  color: Color;
  icon: Icon;
  type: NodeType;
  parentUuid?: number; // 부모 노드 UUID (선택)
}

// Education Node Convert (교육과정 노드 전환)
export interface EducationNodeConvertRequest {
  parentUuid?: number; // 부모 노드 UUID (선택)
}

// Node Response (노드 응답)
export interface NodeResponse {
  uuid: number;
  name: string;
  description?: string;
  color: Color;
  icon: Icon;
  type: NodeType;
  parentUuid?: number;
  childUuids: number[]; // 자식 노드 UUID 배열
  roadmapUuid: number;
  educationUuid?: number; // 교육과정 UUID (교육과정 노드인 경우)
  subject?: Subject; // 교과목 (교육과정 노드인 경우)
  isResolved: boolean; // 문제 해결 여부
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// Node Update (노드 수정)
export interface NodeUpdateRequest {
  name?: string;
  description?: string;
  color?: Color;
  icon?: Icon;
  type?: NodeType;
  parentUuid?: number;
}

// Node List Response (노드 전체 조회)
export interface NodeListResponse {
  nodes: NodeResponse[];
}
