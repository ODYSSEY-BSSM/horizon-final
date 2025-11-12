'use client';

import { FolderRoadmapList, useFolderDetail } from '@/feature/roadmap';

interface RoadmapListSectionProps {
  folderId: string;
  onAddRoadmapClick: () => void;
}

const RoadmapListSection = ({ folderId, onAddRoadmapClick }: RoadmapListSectionProps) => {
  // TODO: folderId should be used to filter roadmaps
  const {
    activeFilter,
    setActiveFilter,
    viewMode,
    setViewMode,
    roadmaps,
    currentPage,
    totalPages,
    onPageChange,
  } = useFolderDetail();

  return (
    <FolderRoadmapList
      activeTab={activeFilter}
      onTabClick={setActiveFilter}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onCreateRoadmap={onAddRoadmapClick}
      roadmaps={roadmaps}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default RoadmapListSection;
