import type { RoadmapColor } from '@/shared/types/roadmap';

export type RoadmapStatus = 'not-started' | 'in-progress' | 'completed';

export type RoadmapType = 'personal' | 'team';

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

export interface CreateRoadmapRequest {
  name: string;
  description?: string;
  icon: string;
  color: RoadmapColor;
  type: RoadmapType;
  folderId?: string;
  totalSteps?: number;
}

export interface UpdateRoadmapRequest extends Partial<CreateRoadmapRequest> {
  id: string;
  completedSteps?: number;
  status?: RoadmapStatus;
  progress?: number;
}

export type RoadmapFilter = 'all' | 'personal' | 'team' | 'in-progress' | 'completed';

export type ViewType = 'list' | 'thumbnail';
