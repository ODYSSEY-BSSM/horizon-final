'use client';

import { useMemo, useState } from 'react';
import { useRootFolder } from '@/feature/folder/hooks/useFolderQueries';
import type { RoadmapColor } from '@/shared/types/roadmap';

const ITEMS_PER_PAGE = 10;

const useFolderDetail = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: rootFolder, isLoading } = useRootFolder();

  const roadmaps = useMemo(() => {
    if (!rootFolder?.directories) {
      return [];
    }

    // 모든 디렉토리를 순회하며 로드맵만 추출
    const allRoadmaps = rootFolder.directories.flatMap((dir) => dir.roadmaps || []);

    return allRoadmaps.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      icon: item.icon.toLowerCase(),
      color: item.color.toLowerCase() as RoadmapColor,
      category: 'personal' as 'personal' | 'team',
      steps: item.progress,
      status: item.progress === 100 ? ('completed' as const) : ('in-progress' as const),
      progress: item.progress,
    }));
  }, [rootFolder]);

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((roadmap) => {
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
