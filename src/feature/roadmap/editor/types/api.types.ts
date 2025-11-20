/**
 * API 타입 정의 - Horizon Roadmap API
 * Swagger: https://raw.githubusercontent.com/leegunwoooo/swagger-ui/refs/heads/master/swagger.json
 */

// ============================================================================
// API Enums
// ============================================================================

/**
 * 노드 타입 (API)
 * React Flow의 'title' | 'standard' | 'secondary'와 매핑됨
 */
export type ApiNodeType = 'TOP' | 'MIDDLE' | 'BOTTOM';

/**
 * 색상 (API)
 */
export type ApiColor = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';

/**
 * 로드맵 아이콘 타입 (API)
 */
export type ApiIcon =
  | 'LANGUAGE'
  | 'CODE'
  | 'SHIELD'
  | 'DATABASE'
  | 'CLOUD'
  | 'MOBILE'
  | 'WEB'
  | 'DESKTOP'
  | 'GAME'
  | 'AI'
  | 'DATA'
  | 'NETWORK'
  | 'SECURITY'
  | 'DEVOPS'
  | 'DESIGN'
  | 'BUSINESS'
  | 'SCIENCE'
  | 'MATH';

// ============================================================================
// Type Mapping Constants
// ============================================================================

/**
 * React Flow 노드 타입 ↔ API 노드 타입 매핑
 */
export const TYPE_MAPPING = {
  // React Flow → API
  title: 'TOP',
  standard: 'MIDDLE',
  secondary: 'BOTTOM',
  // API → React Flow
  TOP: 'title',
  MIDDLE: 'standard',
  BOTTOM: 'secondary',
} as const;

/**
 * React Flow 색상 ↔ API 색상 매핑
 */
export const COLOR_MAPPING = {
  // React Flow → API (소문자 → 대문자)
  red: 'RED',
  orange: 'ORANGE',
  yellow: 'YELLOW',
  green: 'GREEN',
  blue: 'BLUE',
  purple: 'PURPLE',
  // API → React Flow (대문자 → 소문자)
  RED: 'red',
  ORANGE: 'orange',
  YELLOW: 'yellow',
  GREEN: 'green',
  BLUE: 'blue',
  PURPLE: 'purple',
} as const;

// ============================================================================
// Node API Types
// ============================================================================

/**
 * 노드 생성/업데이트 요청 (클라이언트 → 서버)
 */
export interface NodeRequest {
  /** 노드 제목 (max 64 chars) */
  title: string;
  /** 노드 설명 (max 1500 chars) */
  description: string;
  /** 노드 높이 (px) */
  height: number;
  /** 노드 너비 (px) */
  width: number;
  /** 노드 타입 */
  type: ApiNodeType;
  /** X 좌표 (절대 좌표) */
  x: number;
  /** Y 좌표 (절대 좌표) */
  y: number;
  /** 노드 색상 */
  color: ApiColor;
  /** 부모 노드 ID (optional, 섹션 내부 노드인 경우) */
  parentNodeId?: number;
}

/**
 * 간단한 노드 응답 (자식 노드 목록용)
 */
export interface SimpleNodeResponse {
  /** 노드 ID */
  id: number;
  /** 노드 제목 */
  title: string;
  /** 노드 설명 */
  description: string;
}

/**
 * 노드 상세 응답 (서버 → 클라이언트)
 */
export interface NodeResponse {
  /** 노드 ID */
  id: number;
  /** 노드 제목 */
  title: string;
  /** 노드 설명 */
  description: string;
  /** 노드 높이 (px) */
  height: number;
  /** 노드 너비 (px) */
  width: number;
  /** 노드 타입 */
  type: ApiNodeType;
  /** X 좌표 */
  x: number;
  /** Y 좌표 */
  y: number;
  /** 노드 색상 */
  color: ApiColor;
  /** 로드맵 ID */
  roadmapId: number;
  /** 부모 노드 ID */
  parentNodeId: number;
  /** 자식 노드 목록 */
  childNode: SimpleNodeResponse[];
  /** 진행률 (0-100) */
  progress: number;
  /** 교육 여부 */
  isEducation: boolean;
  /** 교육 과목명 */
  subject: string;
}

// ============================================================================
// Roadmap API Types
// ============================================================================

/**
 * 로드맵 생성/업데이트 요청 (클라이언트 → 서버)
 */
export interface RoadmapRequest {
  /** 로드맵 제목 (max 64 chars) */
  title: string;
  /** 로드맵 설명 (max 150 chars) */
  description: string;
  /** 폴더 ID */
  directoryId: number;
  /** 로드맵 색상 */
  color: ApiColor;
  /** 로드맵 아이콘 */
  icon: ApiIcon;
}

/**
 * 로드맵 응답 (서버 → 클라이언트)
 */
export interface RoadmapResponse {
  /** 로드맵 기본 정보 */
  roadmapInfo: {
    /** 로드맵 ID */
    id: number;
    /** 로드맵 제목 */
    title: string;
    /** 로드맵 설명 */
    description: string;
    /** 마지막 수정 일시 */
    lastModifiedAt: string;
    /** 마지막 접근 일시 */
    lastAccessedAt: string;
    /** 즐겨찾기 여부 */
    isFavorite: boolean;
  };
  /** UUID */
  uuid: number;
  /** 로드맵 색상 */
  color: string;
  /** 로드맵 아이콘 */
  icon: string;
  /** 진행률 (0-100) */
  progress: number;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * API 노드 타입 검증
 */
export function isApiNodeType(value: string): value is ApiNodeType {
  return ['TOP', 'MIDDLE', 'BOTTOM'].includes(value);
}

/**
 * API 색상 검증
 */
export function isApiColor(value: string): value is ApiColor {
  return ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE'].includes(value);
}
