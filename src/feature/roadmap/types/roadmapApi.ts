import type { Color, Icon } from '@/shared/api/types';

// ===================================
// Roadmap API Types
// ===================================

// Roadmap Create (개인 로드맵 생성)
export interface RoadmapCreateRequest {
  name: string;
  color: Color;
  icon: Icon;
  directoryUuid?: number; // 디렉토리 UUID (선택)
}

// Roadmap Response (로드맵 응답)
export interface RoadmapResponse {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  isFavorite: boolean;
  directoryUuid?: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  lastAccessedAt?: string; // ISO 8601 format
}

// Roadmap Update (로드맵 수정)
export interface RoadmapUpdateRequest {
  name?: string;
  color?: Color;
  icon?: Icon;
  directoryUuid?: number;
}

// Roadmap Count Response (로드맵 개수 조회)
export interface RoadmapCountResponse {
  count: number;
}

// ===================================
// Team Roadmap API Types
// ===================================

// Team Roadmap Create (팀 로드맵 생성)
export interface TeamRoadmapCreateRequest {
  name: string;
  color: Color;
  icon: Icon;
  directoryUuid?: number; // 팀 디렉토리 UUID (선택)
}

// Team Roadmap Response (팀 로드맵 응답)
export interface TeamRoadmapResponse {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  directoryUuid?: number;
  teamName: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// Team Roadmap Update (팀 로드맵 수정)
export interface TeamRoadmapUpdateRequest {
  name?: string;
  color?: Color;
  icon?: Icon;
  directoryUuid?: number;
}
