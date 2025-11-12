'use client';

import { FolderRoadmapList, useFolderDetail } from '@/feature/roadmap';

interface RoadmapListSectionProps {
  folderId: string;
  onAddRoadmapClick: () => void;
}

const RoadmapListSection = ({ folderId, onAddRoadmapClick }: RoadmapListSectionProps) => {
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
