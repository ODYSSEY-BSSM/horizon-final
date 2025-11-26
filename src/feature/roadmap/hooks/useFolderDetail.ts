'use client';

import { useMemo, useState } from 'react';
import { useRoadmaps, useRoadmapsByDirectory } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { mapRoadmapResponseToRoadmapItem } from '@/shared/utils/roadmapMapper';

const ITEMS_PER_PAGE = 10;

interface UseFolderDetailOptions {
  folderId?: string;
}

const useFolderDetail = (options?: UseFolderDetailOptions) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const directoryId = options?.folderId ? Number(options.folderId) : undefined;

  // Use server-side filtered query when directoryId is provided
  const { data: allRoadmapsData, isLoading: isLoadingAll } = useRoadmaps();
  const { data: directoryRoadmapsData, isLoading: isLoadingDirectory } = useRoadmapsByDirectory(
    directoryId ?? 0,
  );

  // Use directory-filtered data when folderId is provided, otherwise use all roadmaps
  const roadmapsData = directoryId ? directoryRoadmapsData : allRoadmapsData;
  const isLoading = directoryId ? isLoadingDirectory : isLoadingAll;

  const roadmaps = useMemo(() => {
    if (!roadmapsData) {
      return [];
    }

    // Convert API response to RoadmapItem format
    const allRoadmaps = roadmapsData.map(mapRoadmapResponseToRoadmapItem);

    // Deduplicate by ID to prevent duplicate key errors in React
    const uniqueRoadmaps = Array.from(
      new Map(allRoadmaps.map((roadmap) => [roadmap.id, roadmap])).values(),
    );

    return uniqueRoadmaps;
  }, [roadmapsData]);

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
