'use client';

import { TeamFolderRoadmapList, useTeamFolderDetail } from '@/feature/team';

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
  } = useTeamFolderDetail(folderId);

  return (
    <TeamFolderRoadmapList
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
