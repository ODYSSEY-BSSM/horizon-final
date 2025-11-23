'use client';

import { useMemo, useState } from 'react';
import { useRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { mapRoadmapResponseToRoadmapItem } from '@/shared/utils/roadmapMapper';

const ITEMS_PER_PAGE = 10;

interface UseFolderDetailOptions {
  folderId?: string;
}

const useFolderDetail = (options?: UseFolderDetailOptions) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: roadmapsData, isLoading } = useRoadmaps();

  const roadmaps = useMemo(() => {
    if (!roadmapsData) {
      return [];
    }

    // Convert API response to RoadmapItem format
    const allRoadmaps = roadmapsData.map(mapRoadmapResponseToRoadmapItem);

    // Filter by folderId if provided
    if (options?.folderId) {
      const folderIdNum = Number(options.folderId);
      return allRoadmaps.filter((roadmap) => {
        // Find the roadmap in the original response to get directoryId
        const originalRoadmap = roadmapsData.find((r) => r.uuid.toString() === roadmap.id);
        return originalRoadmap?.roadmapInfo?.directoryId === folderIdNum;
      });
    }

    return allRoadmaps;
  }, [roadmapsData, options?.folderId]);

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((roadmap: (typeof roadmaps)[0]) => {
      switch (activeFilter) {
        case 'my':
        case 'team':
          return true;
        case 'completed':
          return roadmap.status === 'completed';
        case 'inProgress':
          return roadmap.status === 'in-progress';
        default:
          return true;
      }
    });
  }, [roadmaps, activeFilter]);

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
    isLoading,
  };
};

export { useFolderDetail };
