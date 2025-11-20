import type { Node } from 'reactflow';
import type { NodeColor } from './node.types';

/**
 * 섹션 노드 데이터
 * React Flow의 Parent Node로 사용되며, 여러 노드를 그룹화하는 영역
 */
export interface SectionNodeData {
  label?: string; // 섹션 제목 (선택사항)
  color?: NodeColor; // 섹션 색상 테마
}

/**
 * React Flow Node 타입 확장
 */
export type HorizonSection = Node<SectionNodeData>;

/**
 * 섹션 생성 파라미터
 */
export interface CreateSectionParams {
  id: string;
  position: { x: number; y: number };
  data?: SectionNodeData;
  style?: {
    width?: number;
    height?: number;
  };
}
