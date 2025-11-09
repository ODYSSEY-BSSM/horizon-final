'use client';

import { useMemo, useState } from 'react';
import { MOCK_ROADMAPS } from '../_data/mockData';

const ITEMS_PER_PAGE = 10;

const useFolderDetail = (_folderId: string) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredRoadmaps = useMemo(() => {
    return MOCK_ROADMAPS.filter((roadmap) => {
      switch (activeFilter) {
        case 'my':
          return roadmap.type === 'my';
        case 'team':
          return roadmap.type === 'team';
        case 'completed':
          return roadmap.progress === 100;
        case 'inProgress':
          return roadmap.progress > 0 && roadmap.progress < 100;
        default:
          return true;
      }
    });
  }, [activeFilter]);

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
    setCurrentPage(1); // Reset to first page when filter changes
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

export default useFolderDetail;
