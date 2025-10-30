import { useMemo, useState } from 'react';
import type { FilterType, RoadmapItem, ViewType } from '@/lib/types/dashboard';
import { ITEMS_PER_PAGE } from './RoadmapList.constants';

export const useRoadmapList = (items: RoadmapItem[] = []) => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (currentFilter === 'all') {
        return true;
      }
      if (currentFilter === 'my') {
        return item.category === 'personal';
      }
      if (currentFilter === 'team') {
        return item.category === 'team';
      }
      if (currentFilter === 'completed') {
        return item.status === 'completed';
      }
      if (currentFilter === 'in-progress') {
        return item.status === 'in-progress';
      }
      return true;
    });
  }, [items, currentFilter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentView,
    currentFilter,
    currentPage,
    totalPages,
    paginatedItems,
    handleViewChange,
    handleFilterChange,
    handlePageChange,
  };
};
