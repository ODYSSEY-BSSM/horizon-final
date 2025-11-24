'use client';

import { useMemo, useState } from 'react';
import { useTeamRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
import type { Roadmap } from '@/feature/team/types/team';
import { mapTeamRoadmapResponseToRoadmapItem } from '@/shared/utils/roadmapMapper';

const ITEMS_PER_PAGE = 10;

const useFolderDetail = (teamId: string, folderId: string) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: teamRoadmapsData } = useTeamRoadmaps(Number(teamId));

  const allRoadmaps: Roadmap[] = useMemo(() => {
    if (!teamRoadmapsData) {
      return [];
    }

    // Convert API response to RoadmapItem format first
    const allItems = teamRoadmapsData.map(mapTeamRoadmapResponseToRoadmapItem);

    // Filter by folderId
    const folderIdNum = Number(folderId);
    const filteredItems = allItems.filter((item) => {
      const originalRoadmap = teamRoadmapsData.find((r) => r.uuid.toString() === item.id);
      return originalRoadmap?.roadmapInfo?.directoryId === folderIdNum;
    });

    // Convert RoadmapItem to Roadmap (team-specific type)
    const roadmaps = filteredItems.map((item) => {
      const originalRoadmap = teamRoadmapsData.find((r) => r.uuid.toString() === item.id);
      // Map 'not-started' to 'in-progress' for team Roadmap type
      const status = item.status === 'not-started' ? 'in-progress' : item.status;
      return {
        id: item.id,
        folderId: folderId,
        name: item.title,
        description: originalRoadmap?.roadmapInfo?.description || '',
        icon: item.icon,
        color: item.color,
        type: 'team' as const,
        totalSteps: 0,
        completedSteps: 0,
        status: status as 'in-progress' | 'completed',
        progress: item.progress,
      };
    });

    // Deduplicate by ID to prevent duplicate key errors in React
    const uniqueRoadmaps = Array.from(
      new Map(roadmaps.map((roadmap) => [roadmap.id, roadmap])).values(),
    );

    return uniqueRoadmaps;
  }, [teamRoadmapsData, folderId]);

  const filteredRoadmaps = useMemo(() => {
    return allRoadmaps.filter((roadmap: Roadmap) => {
      switch (activeFilter) {
        case 'completed':
          return roadmap.status === 'completed';
        case 'inProgress':
          return roadmap.status === 'in-progress';
        case 'all':
        default:
          return true;
      }
    });
  }, [allRoadmaps, activeFilter]);

  const totalPages = Math.ceil(filteredRoadmaps.length / ITEMS_PER_PAGE);

  const paginatedRoadmaps = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredRoadmaps.slice(startIndex, endIndex);
  }, [filteredRoadmaps, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  return {
    activeFilter,
    setActiveFilter: handleFilterChange,
    viewMode,
    setViewMode,
    roadmaps: paginatedRoadmaps,
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  };
};

export { useFolderDetail as useTeamFolderDetail };
