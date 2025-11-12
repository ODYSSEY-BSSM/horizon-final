import type { RoadmapColor } from '@/shared/types/roadmap';

export type MenuItemType = 'dashboard' | 'my-roadmaps' | 'team-space' | 'school-connect';

export interface MenuItem {
  id: MenuItemType;
  icon: string;
  label: string;
  checked?: boolean;
  path: string;
}

export type RoadmapCategory = 'my-roadmaps' | 'team-roadmaps' | 'connected-school';

export interface InfoCardData {
  category: RoadmapCategory;
  count: number;
  subCount?: number;
  schoolName?: string;
  hasItem: boolean;
}

export type RoadmapStatus = 'in-progress' | 'completed';

export interface DashboardRoadmapCard {
  id: string;
  title: string;
  icon: string;
  color: RoadmapColor;
  category: 'personal' | 'team';
  steps: number;
  status: RoadmapStatus;
  progress: number;
}

// Deprecated: Use DashboardRoadmapCard instead
export type RoadmapItem = DashboardRoadmapCard;

export type FilterType = 'all' | 'my' | 'team' | 'completed' | 'in-progress';

export type ViewType = 'list' | 'thumbnail';
