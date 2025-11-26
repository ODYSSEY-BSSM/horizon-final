'use client';

import { useMemo, useState } from 'react';
import type { RoadmapItem, ViewType } from '@/shared/types';

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_THUMBNAIL = 12;

/**
 * 로드맵 리스트 관리 훅
 *
 * 필터링, 페이지네이션, 뷰 모드 관리를 처리합니다.
 * 대시보드에서 사용됩니다.
 */
export const useRoadmapList = (items: RoadmapItem[] = []) => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [currentFilter, setCurrentFilter] = useState<string>('all');
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
        return item.status === 'in-progress' && item.progress > 0;
      }
      return true;
    });
  }, [items, currentFilter]);

  const itemsPerPage = currentView === 'thumbnail' ? ITEMS_PER_PAGE_THUMBNAIL : ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setCurrentPage(1);
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
