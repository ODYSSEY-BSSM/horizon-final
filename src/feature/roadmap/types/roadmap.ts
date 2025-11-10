import type { RoadmapColor } from '@/shared/types/roadmap';

export type RoadmapStatus = 'not-started' | 'in-progress' | 'completed';

export type RoadmapType = 'personal' | 'team';

/**
 * 통합된 로드맵 타입
 * dashboard, my-roadmaps, team-space에서 모두 사용
 */
export interface Roadmap {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: RoadmapColor;
  type: RoadmapType;
  totalSteps: number;
  completedSteps: number;
  status: RoadmapStatus;
  progress: number; // 0-100
  folderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 로드맵 폴더 타입
 */
export interface RoadmapFolder {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: RoadmapColor;
  roadmapCount: number;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 로드맵 생성 요청
 */
export interface CreateRoadmapRequest {
  name: string;
  description?: string;
  icon: string;
  color: RoadmapColor;
  type: RoadmapType;
  folderId?: string;
  totalSteps?: number;
}

/**
 * 로드맵 수정 요청
 */
export interface UpdateRoadmapRequest extends Partial<CreateRoadmapRequest> {
  id: string;
  completedSteps?: number;
  status?: RoadmapStatus;
  progress?: number;
}

/**
 * 필터 타입
 */
export type RoadmapFilter = 'all' | 'personal' | 'team' | 'in-progress' | 'completed';

/**
 * 뷰 타입
 */
export type ViewType = 'list' | 'thumbnail';
