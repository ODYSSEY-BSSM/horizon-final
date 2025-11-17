import type { NodeType } from '../types/node.types';

/**
 * React Flow 노드 타입 상수
 */
export const HORIZON_NODE_TYPES = {
  TITLE: 'horizonTitle',
  STANDARD: 'horizonStandard',
  SECONDARY: 'horizonSecondary',
} as const;

/**
 * 노드 타입 매핑
 */
export const NODE_TYPE_MAP: Record<NodeType, string> = {
  title: HORIZON_NODE_TYPES.TITLE,
  standard: HORIZON_NODE_TYPES.STANDARD,
  secondary: HORIZON_NODE_TYPES.SECONDARY,
};

/**
 * 노드 기본 크기
 */
export const NODE_DIMENSIONS = {
  TITLE: {
    width: 240,
    height: 56,
  },
  STANDARD: {
    width: 248,
    height: 120,
  },
  SECONDARY: {
    width: 248,
    height: 100,
  },
} as const;

/**
 * 핸들(연결점) 위치
 */
export const HANDLE_POSITIONS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
} as const;
