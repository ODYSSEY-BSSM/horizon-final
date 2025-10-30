export type MenuItemType = 'dashboard' | 'my-roadmaps' | 'team-space' | 'school-connect';

export interface MenuItem {
  id: MenuItemType;
  icon: string;
  label: string;
  checked?: boolean;
}

export type RoadmapCategory = 'my-roadmaps' | 'team-roadmaps' | 'connected-school';

export interface InfoCardData {
  category: RoadmapCategory;
  count: number;
  subCount?: number;
  schoolName?: string;
  hasItem: boolean;
}

export type RoadmapColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

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
