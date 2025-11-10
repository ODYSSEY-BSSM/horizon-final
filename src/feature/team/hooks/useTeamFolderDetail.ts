'use client';

import { useMemo, useState } from 'react';
import type { Roadmap } from '@/lib/types/team';
import { useTeamSpaceData } from '@/feature/team';

const ITEMS_PER_PAGE = 10;

const useFolderDetail = (folderId: string) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { getFolderRoadmaps } = useTeamSpaceData();
  const allRoadmaps = getFolderRoadmaps(folderId);

  const filteredRoadmaps = useMemo(() => {
    return allRoadmaps.filter((roadmap: Roadmap) => {
      switch (activeFilter) {
        case 'my':
          return roadmap.type === 'personal';
        case 'team':
          return roadmap.type === 'team';
        case 'completed':
          return roadmap.status === 'completed';
        case 'inProgress':
          return roadmap.status === 'in-progress';
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
