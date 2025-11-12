'use client';

import { useMemo, useState } from 'react';
import { useRootFolder } from '@/feature/folder/hooks/useFolderQueries';
import type { RoadmapColor } from '@/shared/types/roadmap';

const ITEMS_PER_PAGE = 10;

interface UseFolderDetailOptions {
  folderId?: string;
}

const useFolderDetail = (options?: UseFolderDetailOptions) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: rootFolder, isLoading } = useRootFolder();

  const roadmaps = useMemo(() => {
    if (!rootFolder?.items) {
      return [];
    }

    // 로드맵만 추출
    let allRoadmaps = rootFolder.items.filter((item) => item.type === 'roadmap');

    // folderId가 제공되면 해당 폴더의 로드맵만 필터링
    if (options?.folderId) {
      const folderIdNum = Number(options.folderId);
      allRoadmaps = allRoadmaps.filter((item) => item.parentUuid === folderIdNum);
    }

    return allRoadmaps.map((item) => ({
      id: item.uuid.toString(),
      title: item.name,
      icon: item.icon.toLowerCase(),
      color: item.color.toLowerCase() as RoadmapColor,
      category: 'personal' as 'personal' | 'team',
      steps: 0, // TODO: progress 데이터 필요
      status: ('in-progress' as 'completed' | 'in-progress'), // TODO: status 데이터 필요
      progress: 0, // TODO: progress 데이터 필요
    }));
  }, [rootFolder, options?.folderId]);

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
