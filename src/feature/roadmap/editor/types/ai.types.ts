/**
 * AI API 타입 정의
 * Swagger: https://raw.githubusercontent.com/leegunwoooo/swagger-ui/refs/heads/master/swagger.json
 */

import type { ApiNodeType, NodeResponse, SimpleNodeResponse } from './api.types';

// ============================================================================
// AI Roadmap Generation Types
// ============================================================================

/**
 * AI 로드맵 생성 시 코스 정보
 */
export interface CourseInput {
  /** 코스 제목 */
  title: string;
  /** 코스 설명 */
  description: string;
}

/**
 * AI 로드맵 생성 요청 (클라이언트 → 서버)
 * POST /directories/{directoryId}/nodes/ai
 */
export interface AIRoadmapGenerateRequest {
  /** 로드맵 설명 */
  description: string;
  /** 포함할 언어/기술 */
  language: string;
  /** 코스 목록 */
  courses: CourseInput[];
}

/**
 * AI 로드맵 생성 응답 (서버 → 클라이언트)
 */
export interface AIRoadmapGenerateResponse {
  /** 생성된 로드맵 정보 */
  roadmap: {
    /** 로드맵 ID */
    id: number;
    /** 로드맵 제목 */
    title: string;
  };
  /** 생성된 노드 목록 */
  nodes: NodeResponse[];
}

// ============================================================================
// AI Node Modification Types
// ============================================================================

/**
 * AI 노드 수정 시 노드 정보
 */
export interface AINodeInput {
  /** 노드 ID */
  id: number;
  /** 노드 제목 */
  title: string;
  /** 노드 설명 */
  description: string;
  /** 노드 타입 */
  type: ApiNodeType;
  /** X 좌표 */
  x: number;
  /** Y 좌표 */
  y: number;
  /** 부모 노드 ID */
  parentNodeId?: number;
  /** 교육 노드 여부 */
  isEducation: boolean;
}

/**
 * AI 노드 수정 요청 (클라이언트 → 서버)
 * PUT /roadmap/{roadmapId}/nodes/ai
 */
export interface AINodeModifyRequest {
  /** 수정 요청 설명 */
  description: string;
  /** 수정할 노드 목록 */
  nodes: AINodeInput[];
}

/**
 * AI 노드 수정 응답 (서버 → 클라이언트)
 */
export type AINodeModifyResponse = SimpleNodeResponse;
