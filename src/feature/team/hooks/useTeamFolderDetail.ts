'use client';

import { useMemo, useState } from 'react';
import { useTeamRootFolder } from '@/feature/folder/hooks/useFolderQueries';
import type { Roadmap } from '@/feature/team/types/team';
import type { RoadmapColor } from '@/shared/types/roadmap';

const ITEMS_PER_PAGE = 10;

const useFolderDetail = (teamId: string, folderId: string) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: teamRootFolder } = useTeamRootFolder(Number(teamId));

  const allRoadmaps: Roadmap[] = useMemo(() => {
    if (!teamRootFolder?.directories) {
      return [];
    }

    // 재귀적으로 특정 디렉토리 찾기
    const findDirectory = (dirs: typeof teamRootFolder.directories, id: number): any => {
      for (const dir of dirs) {
        if (dir.id === id) return dir;
        if (dir.directories?.length) {
          const found = findDirectory(dir.directories, id);
          if (found) return found;
        }
      }
      return null;
    };

    const targetDir = findDirectory(teamRootFolder.directories, Number(folderId));
    const roadmapList = targetDir?.roadmaps || [];

    return roadmapList.map((roadmap: any) => ({
      id: roadmap.id?.toString() || '',
      folderId: folderId,
      name: roadmap.title || '',
      description: '', // TODO: API에서 description 제공 필요
      icon: 'folder',
      color: 'blue' as RoadmapColor,
      type: 'team' as 'personal' | 'team',
      totalSteps: 0,
      completedSteps: 0,
      status: 'in-progress' as 'completed' | 'in-progress',
      progress: 0,
    }));
  }, [teamRootFolder, folderId]);

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
