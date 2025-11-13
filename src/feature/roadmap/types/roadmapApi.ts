import type { Color, Icon } from '@/shared/api/types';

export interface RoadmapCreateRequest {
  title: string;
  description: string;
  categories: string[];
  directoryId: number;
  color: Color;
  icon: Icon;
}

export interface RoadmapResponse {
  id: number;
  title: string;
  description: string;
  categories: string[];
  lastModifiedAt: string;
  lastAccessedAt: string;
  isFavorite: boolean;
  color: string;
  icon: string;
  progress: number;
  directoryId?: number;
}

// Personal Roadmap Update (개인 로드맵 수정)
export interface RoadmapUpdateRequest {
  title?: string;
  description?: string;
  categories?: string[];
  color?: Color;
  icon?: Icon;
  directoryId?: number;
}

export interface RoadmapCountResponse {
  count: number;
}

// Team Roadmap Create (팀 로드맵 생성)
export interface TeamRoadmapCreateRequest {
  title: string;
  description: string;
  categories: string[];
  directoryId?: number;
  color: Color;
  icon: Icon;
}

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

export type AnyRoadmapResponse = RoadmapResponse | TeamRoadmapResponse;

export function isTeamRoadmap(roadmap: AnyRoadmapResponse): roadmap is TeamRoadmapResponse {
  return 'teamId' in roadmap && 'teamName' in roadmap;
}

export function isPersonalRoadmap(roadmap: AnyRoadmapResponse): roadmap is RoadmapResponse {
  return 'isFavorite' in roadmap;
}
