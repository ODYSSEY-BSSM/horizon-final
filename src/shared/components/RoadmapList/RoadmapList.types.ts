import type { FilterTab, RoadmapItem, ViewType } from '@/shared/types';

/**
 * 통합 RoadmapList 컴포넌트 Props
 */
export interface RoadmapListProps {
  // 데이터
  items: RoadmapItem[];

  // 뷰 모드
  viewMode?: ViewType;
  onViewModeChange?: (mode: ViewType) => void;
  showViewToggle?: boolean;

  // 필터 탭
  filterTabs?: FilterTab[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  showFilterTabs?: boolean;

  // 페이지네이션
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;

  // 액션
  onAddRoadmap?: () => void;
  onRoadmapClick?: (roadmapId: string) => void;

  // 커스터마이징
  title?: string;
  showHeader?: boolean;
  emptyMessage?: string;
  className?: string;
}
