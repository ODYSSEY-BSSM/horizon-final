'use client';

import { useMemo, useState } from 'react';
import { useFolderContent } from '@/feature/folder/hooks/useFolderQueries';
import type { RoadmapColor } from '@/shared/types/roadmap';

const ITEMS_PER_PAGE = 10;

const useFolderDetail = (folderId: string) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: folderContent, isLoading } = useFolderContent(Number(folderId));

  const roadmaps = useMemo(() => {
    if (!folderContent?.items) {
      return [];
    }

    return folderContent.items
      .filter((item) => item.type === 'roadmap')
      .map((item) => ({
        id: item.uuid.toString(),
        title: item.name,
        icon: item.icon.toLowerCase(),
        color: item.color.toLowerCase() as RoadmapColor,
        category: 'personal' as 'personal' | 'team',
        steps: 0, // TODO: API에서 단계 정보를 제공하면 업데이트 필요
        status: 'in-progress' as 'in-progress' | 'completed',
        progress: 0,
      }));
  }, [folderContent]);

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
