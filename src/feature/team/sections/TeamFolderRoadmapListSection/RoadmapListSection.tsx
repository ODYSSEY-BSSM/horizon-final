'use client';

import { useMemo } from 'react';
import { FolderRoadmapList } from '@/feature/roadmap';
import { mapTeamRoadmapToRoadmapItem, useTeamFolderDetail } from '@/feature/team';

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

  // 팀 로드맵을 개인 로드맵 형식으로 변환
  const mappedRoadmaps = useMemo(() => roadmaps.map(mapTeamRoadmapToRoadmapItem), [roadmaps]);

  return (
    <FolderRoadmapList
      activeTab={activeFilter}
      onTabClick={setActiveFilter}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onCreateRoadmap={onAddRoadmapClick}
      roadmaps={mappedRoadmaps}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default RoadmapListSection;
