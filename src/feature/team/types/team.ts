import type { RoadmapColor } from '@/shared/types/roadmap';

export type Team = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
};

export type TeamFolder = {
  id: string;
  teamId: string;
  name: string;
  description: string;
  progress: number;
  roadmapCount: number;
  createdRoadmapCount: number;
  lastRoadmapName?: string;
};

export type TeamRoadmap = {
  id: string;
  folderId: string;
  name: string;
  description: string;
  progress?: number;
  totalSteps?: number;
  completedSteps?: number;
  type?: 'personal' | 'team';
  status?: 'in-progress' | 'completed';
  icon?: string;
  color?: RoadmapColor;
  createdAt?: string;
  updatedAt?: string;
};

// Deprecated: Use TeamRoadmap instead
export type Roadmap = TeamRoadmap;

export type FilterTab = {
  label: string;
  value: string;
};
