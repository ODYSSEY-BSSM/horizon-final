import type { FilterType, RoadmapItem, ViewType } from '@/lib/types/dashboard';

export interface RoadmapListProps {
  className?: string;
  items?: RoadmapItem[];
  onAddRoadmap?: () => void;
  onViewChange?: (view: ViewType) => void;
  onFilterChange?: (filter: FilterType) => void;
}

export interface ListHeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAddRoadmap: () => void;
}

export interface FilterTapProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface RoadmapListItemProps {
  item: RoadmapItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
