'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { mapTeamRoadmapToRoadmapItem, useTeamFolderDetail } from '@/feature/team';
import { RoadmapList } from '@/shared/components/RoadmapList';
import { TEAM_FOLDER_FILTER_TABS } from '@/shared/constants/filterTabs';

interface RoadmapListSectionProps {
  teamId: string;
  folderId: string;
  onAddRoadmapClick: () => void;
}

const RoadmapListSection = ({ teamId, folderId, onAddRoadmapClick }: RoadmapListSectionProps) => {
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
  } = useTeamFolderDetail(teamId, folderId);

  // 팀 로드맵을 개인 로드맵 형식으로 변환
  const mappedRoadmaps = useMemo(() => roadmaps.map(mapTeamRoadmapToRoadmapItem), [roadmaps]);

  const handleRoadmapClick = (roadmapId: string) => {
    router.push(`/editor/${roadmapId}`);
  };

  return (
    <RoadmapList
      items={mappedRoadmaps}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      showViewToggle
      filterTabs={TEAM_FOLDER_FILTER_TABS}
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
