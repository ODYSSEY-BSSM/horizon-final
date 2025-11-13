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
    if (!rootFolder?.directories) {
      return [];
    }

    if (options?.folderId) {
      const folderIdNum = Number(options.folderId);
      const findDirectory = (dirs: typeof rootFolder.directories, id: number): any => {
        for (const dir of dirs) {
          if (dir.id === id) {
            return dir;
          }
          if (dir.directories?.length) {
            const found = findDirectory(dir.directories, id);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      const targetDir = findDirectory(rootFolder.directories, folderIdNum);
      const roadmapList = targetDir?.roadmaps || [];

      return roadmapList.map((roadmap: any) => ({
        id: roadmap.id?.toString() || '',
        title: roadmap.title || '',
        icon: 'folder',
        color: 'blue' as RoadmapColor,
        category: 'personal' as 'personal' | 'team',
        steps: 0,
        status: 'in-progress' as 'completed' | 'in-progress',
        progress: 0,
      }));
    }

    const collectAllRoadmaps = (dirs: typeof rootFolder.directories): any[] => {
      let all: any[] = [];
      for (const dir of dirs) {
        all = all.concat(dir.roadmaps || []);
        if (dir.directories?.length) {
          all = all.concat(collectAllRoadmaps(dir.directories));
        }
      }
      return all;
    };

    const allRoadmaps = collectAllRoadmaps(rootFolder.directories);

    return allRoadmaps.map((roadmap: any) => ({
      id: roadmap.id?.toString() || '',
      title: roadmap.title || '',
      icon: 'folder',
      color: 'blue' as RoadmapColor,
      category: 'personal' as 'personal' | 'team',
      steps: 0,
      status: 'in-progress' as 'completed' | 'in-progress',
      progress: 0,
    }));
  }, [rootFolder, options?.folderId]);

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
