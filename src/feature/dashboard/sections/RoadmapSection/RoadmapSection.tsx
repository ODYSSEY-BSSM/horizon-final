'use client';

import { useRouter } from 'next/navigation';
import { RoadmapList } from '@/shared/components/RoadmapList';
import { DASHBOARD_FILTER_TABS } from '@/shared/constants/filterTabs';
import { useRoadmapList } from '@/shared/hooks/useRoadmapList';
import type { RoadmapItem } from '@/shared/types';

interface RoadmapSectionProps {
  items: RoadmapItem[];
  onAddRoadmap: () => void;
}

const RoadmapSection = ({ items, onAddRoadmap }: RoadmapSectionProps) => {
  const router = useRouter();
  const {
    currentView,
    currentFilter,
    currentPage,
    totalPages,
    paginatedItems,
    handleViewChange,
    handleFilterChange,
    handlePageChange,
  } = useRoadmapList(items);

  const handleRoadmapClick = (roadmapId: string) => {
    router.push(`/viewer/${roadmapId}`);
  };

  return (
    <RoadmapList
      items={paginatedItems}
      viewMode={currentView}
      onViewModeChange={handleViewChange}
      showViewToggle
      filterTabs={DASHBOARD_FILTER_TABS}
      activeFilter={currentFilter}
      onFilterChange={handleFilterChange}
      showFilterTabs
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      showPagination
      onAddRoadmap={onAddRoadmap}
      onRoadmapClick={handleRoadmapClick}
      title="로드맵 리스트"
      showHeader
    />
  );
};

export default RoadmapSection;
