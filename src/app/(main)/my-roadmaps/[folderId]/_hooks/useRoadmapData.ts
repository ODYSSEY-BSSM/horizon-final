import { useMemo } from 'react';
import {
  CARD_VIEW_ITEMS_PER_PAGE,
  LIST_VIEW_ITEMS_PER_PAGE,
} from '../_constants/pagination.constants';
import { MOCK_ROADMAPS } from '../_data/mockData';
import type { FilterType, ViewMode } from '../_types';

interface UseRoadmapDataProps {
  filter: FilterType;
  viewMode: ViewMode;
  currentPage: number;
}

export const useRoadmapData = ({ filter, viewMode, currentPage }: UseRoadmapDataProps) => {
  // Filter roadmaps based on active filter
  const filteredRoadmaps = useMemo(() => {
    if (filter === 'all') {
      return MOCK_ROADMAPS;
    }

    return MOCK_ROADMAPS.filter((roadmap) => {
      switch (filter) {
        case 'my':
          return roadmap.metadata.type === 'personal';
        case 'team':
          return roadmap.metadata.type === 'team';
        case 'completed':
          return roadmap.metadata.status === 'completed';
        case 'in-progress':
          return roadmap.metadata.status === 'in-progress';
        default:
          return true;
      }
    });
  }, [filter]);

  // Calculate pagination
  const itemsPerPage = viewMode === 'list' ? LIST_VIEW_ITEMS_PER_PAGE : CARD_VIEW_ITEMS_PER_PAGE;
  const totalItems = filteredRoadmaps.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get paginated roadmaps
  const paginatedRoadmaps = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRoadmaps.slice(startIndex, endIndex);
  }, [filteredRoadmaps, currentPage, itemsPerPage]);

  return {
    roadmaps: paginatedRoadmaps,
    totalItems,
    totalPages,
    itemsPerPage,
    isEmpty: filteredRoadmaps.length === 0,
  };
};
