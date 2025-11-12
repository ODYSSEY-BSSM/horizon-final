import type { RoadmapColor } from '@/shared/types/roadmap';

export type MenuItemType = 'dashboard' | 'my-roadmaps' | 'team-space' | 'school-connect';

export interface MenuItem {
  id: MenuItemType;
  icon: string;
  label: string;
  checked?: boolean;
  path: string;
}

export type RoadmapCategory =
  | 'my-roadmap-count'
  | 'my-roadmap-in-progress'
  | 'team-roadmap-count'
  | 'team-roadmap-in-progress'
  | 'connected-school';

export interface InfoCardData {
  'my-roadmap-count'?: { count: number };
  'my-roadmap-in-progress'?: { count: number; subCount: number };
  'team-roadmap-count'?: { count: number };
  'team-roadmap-in-progress'?: { count: number; subCount: number };
  'connected-school'?: { schoolName: string; hasItem: boolean };
}

export type RoadmapStatus = 'in-progress' | 'completed';

export interface RoadmapItem {
  id: string;
  title: string;
  icon: string;
  color: RoadmapColor;
  category: 'personal' | 'team';
  steps: number;
  status: RoadmapStatus;
  progress: number;
}

export type FilterType = 'all' | 'my' | 'team' | 'completed' | 'in-progress';

export type ViewType = 'list' | 'thumbnail';
