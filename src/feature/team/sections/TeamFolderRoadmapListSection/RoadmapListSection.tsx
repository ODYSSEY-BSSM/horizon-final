'use client';

import { TeamFolderRoadmapList, useTeamFolderDetail } from '@/feature/team';

interface RoadmapListSectionProps {
  teamId: string;
  folderId: string;
  onAddRoadmapClick: () => void;
}

const RoadmapListSection = ({ teamId, folderId, onAddRoadmapClick }: RoadmapListSectionProps) => {
  const {
    activeFilter,
    setActiveFilter,
    viewMode,
    setViewMode,
    roadmaps,
    currentPage,
    totalPages,
    onPageChange,
  } = useTeamFolderDetail(teamId, folderId);

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
