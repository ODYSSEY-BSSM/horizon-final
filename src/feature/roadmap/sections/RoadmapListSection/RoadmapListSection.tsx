'use client';

import { useRouter } from 'next/navigation';
import { useFolderDetail } from '@/feature/roadmap';
import { RoadmapList } from '@/shared/components/RoadmapList';
import { FOLDER_STATUS_TABS } from '@/shared/constants/filterTabs';

interface RoadmapListSectionProps {
  folderId: string;
  onAddRoadmapClick: () => void;
}

const RoadmapListSection = ({ folderId, onAddRoadmapClick }: RoadmapListSectionProps) => {
  const router = useRouter();
  const {
    activeFilter,
    setActiveFilter,
    viewMode,
    setViewMode,
    roadmaps,
    currentPage,
    totalPages,
    onPageChange,
  } = useFolderDetail({ folderId });

  const handleRoadmapClick = (roadmapId: string) => {
    router.push(`/roadmap/${roadmapId}`);
  };

  return (
    <RoadmapList
      items={roadmaps}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      showViewToggle
      filterTabs={FOLDER_STATUS_TABS}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      showFilterTabs
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      showPagination
      onAddRoadmap={onAddRoadmapClick}
      onRoadmapClick={handleRoadmapClick}
      title="로드맵 리스트"
      showHeader
    />
  );
};

export default RoadmapListSection;
