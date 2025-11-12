import type { Color, Icon } from '@/shared/api/types';

// ===================================
// Roadmap API Types (Swagger API)
// ===================================

// Roadmap Create (개인 로드맵 생성)
export interface RoadmapCreateRequest {
  title: string; // 0-64자
  description: string; // 0-150자
  categories: string[]; // 카테고리 목록
  directoryId: number; // 디렉토리 ID
  color: Color;
  icon: Icon;
}

// Roadmap Response (로드맵 응답)
export interface RoadmapResponse {
  id: number;
  title: string;
  description: string;
  categories: string[];
  lastModifiedAt: string; // date
  lastAccessedAt: string; // date-time
  isFavorite: boolean;
  color: string;
  icon: string;
  progress: number; // int32
  directoryId?: number;
}

// Roadmap Update (로드맵 수정)
export interface RoadmapUpdateRequest {
  title?: string;
  description?: string;
  categories?: string[];
  color?: Color;
  icon?: Icon;
  directoryId?: number;
}

// Roadmap Count Response (로드맵 개수 조회)
export interface RoadmapCountResponse {
  count: number;
}

// ===================================
// Team Roadmap API Types (Swagger API)
// ===================================

// Team Roadmap Create (팀 로드맵 생성)
export interface TeamRoadmapCreateRequest {
  title: string;
  description: string;
  categories: string[];
  directoryId?: number;
  color: Color;
  icon: Icon;
}

// Team Roadmap Response (팀 로드맵 응답)
export interface TeamRoadmapResponse {
  id: number;
  title: string;
  description: string;
  categories: string[];
  lastModifiedAt: string;
  lastAccessedAt: string;
  color: string;
  icon: string;
  progress: number;
  directoryId?: number;
  teamId: number;
  teamName: string;
}

// Team Roadmap Update (팀 로드맵 수정)
export interface TeamRoadmapUpdateRequest {
  title?: string;
  description?: string;
  categories?: string[];
  color?: Color;
  icon?: Icon;
  directoryId?: number;
}
