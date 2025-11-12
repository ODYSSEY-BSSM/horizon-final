import type { Edge, Node } from '@xyflow/react';

// 백엔드 API 명세서에 맞춘 타입 정의
export type NodeColor = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'PURPLE' | 'ORANGE';
export type StudioNodeType = 'TOP' | 'BOTTOM' | 'MIDDLE';

// 백엔드 API 응답 구조
export interface StudioNodeData {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: StudioNodeType;
  x: number;
  y: number;
  color: NodeColor;
  roadmapId: number;
  parentNodeId: number | null;
  childNode: StudioNodeData[];
  progress: number;
  isEducation: boolean;
  subject: string;
}

// React Flow Node 타입 (백엔드 데이터를 React Flow 형식으로 변환)
export interface StudioNode extends Node {
  id: string;
  type: 'roadmap' | 'milestone' | 'task';
  position: { x: number; y: number };
  data: {
    // 백엔드에서 받은 원본 데이터
    id: number;
    title: string;
    description: string;
    color: NodeColor;
    progress: number;
    isEducation: boolean;
    subject: string;
    roadmapId: number;
    parentNodeId: number | null;
    // UI 상태
    width?: number;
    height?: number;
  };
}

// React Flow Edge 타입
export interface StudioEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'straight' | 'step' | 'smoothstep';
}

// 노드 생성/수정 요청 타입
export interface CreateNodeRequest {
  title: string;
  description: string;
  height: number;
  width: number;
  type: StudioNodeType;
  x: number;
  y: number;
  color: NodeColor;
  parentNodeId: number | null;
}

export interface UpdateNodeRequest {
  title: string;
  description: string;
  height: number;
  width: number;
  type: StudioNodeType;
  x: number;
  y: number;
  color: NodeColor;
  parentNodeId: number | null;
}

// 노드 색상 헬퍼
export const NODE_COLORS: Record<NodeColor, string> = {
  RED: '#DC2626',
  BLUE: '#2563EB',
  GREEN: '#10B981',
  YELLOW: '#F59E0B',
  PURPLE: '#9333EA',
  ORANGE: '#EA580C',
};

// 진행률 색상 (API 명세서의 진행률 시스템)
export function getProgressColor(progress: number): string {
  if (progress >= 67) {
    return NODE_COLORS.GREEN; // 완료
  }
  if (progress >= 34) {
    return NODE_COLORS.YELLOW; // 진행중
  }
  return NODE_COLORS.RED; // 시작
}
