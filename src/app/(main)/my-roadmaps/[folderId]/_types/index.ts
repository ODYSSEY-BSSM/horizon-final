export type ViewMode = 'list' | 'card';

export type FilterType = 'all' | 'my' | 'team' | 'completed' | 'in-progress';

export type RoadmapType = 'personal' | 'team';

export type RoadmapStatus = 'not-started' | 'in-progress' | 'completed';

export interface RoadmapMetadata {
  type: RoadmapType;
  stepsCount: number;
  status: RoadmapStatus;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  progress: number;
  metadata: RoadmapMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}
