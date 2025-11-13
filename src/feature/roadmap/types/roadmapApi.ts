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

export interface TeamRoadmapUpdateRequest {
  title?: string;
  description?: string;
  categories?: string[];
  color?: Color;
  icon?: Icon;
  directoryId?: number;
}
