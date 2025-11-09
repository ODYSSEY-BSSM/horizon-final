'use client';

import FolderRoadmapList from '../_components/FolderRoadmapList';
import useFolderDetail from '../_hooks/useFolderDetail';

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
  } = useFolderDetail(folderId);

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
