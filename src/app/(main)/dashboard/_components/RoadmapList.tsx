'use client';

import { useMemo, useState } from 'react';
import type { FilterType, RoadmapItem, ViewType } from '@/lib/types/dashboard';
import type { RoadmapFormData } from '@/lib/types/modal';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_THUMBNAIL } from '../_constants/RoadmapList.constants';
import RoadmapFormModal from '../_forms/RoadmapFormModal/RoadmapFormModal';
import FilterTap from './FilterTap';
import ListHeader from './ListHeader';
import Pagination from './Pagination';
import RoadmapCard from './RoadmapCard';
import { ListContainer, ListItemsContainer, ThumbnailGridContainer } from './RoadmapList.styles';
import RoadmapListItem from './RoadmapListItem';

// Types
export interface RoadmapListProps {
  className?: string;
  items?: RoadmapItem[];
  onAddRoadmap?: () => void;
  onViewChange?: (view: ViewType) => void;
  onFilterChange?: (filter: FilterType) => void;
}

// Hook
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

  const itemsPerPage = currentView === 'thumbnail' ? ITEMS_PER_PAGE_THUMBNAIL : ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setCurrentPage(1); // Reset to first page when view changes
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

const RoadmapList = ({
  items = [],
  onAddRoadmap = () => undefined,
  onViewChange,
  onFilterChange,
  className,
}: RoadmapListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    currentView,
    currentFilter,
    currentPage,
    totalPages,
    paginatedItems,
    handleViewChange,
    handleFilterChange,
    handlePageChange,
  } = useRoadmapList(items);

  const handleViewChangeInternal = (view: typeof currentView) => {
    handleViewChange(view);
    onViewChange?.(view);
  };

  const handleFilterChangeInternal = (filter: typeof currentFilter) => {
    handleFilterChange(filter);
    onFilterChange?.(filter);
  };

  const handleAddRoadmapClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (_data: RoadmapFormData) => {
    onAddRoadmap();
    setIsModalOpen(false);
  };

  return (
    <>
      <ListContainer className={className} data-node-id="4510:1924">
        <ListHeader
          currentView={currentView}
          onViewChange={handleViewChangeInternal}
          onAddRoadmap={handleAddRoadmapClick}
        />
        <FilterTap currentFilter={currentFilter} onFilterChange={handleFilterChangeInternal} />

        {currentView === 'list' ? (
          <ListItemsContainer>
            {paginatedItems.map((item) => (
              <RoadmapListItem key={item.id} item={item} />
            ))}
          </ListItemsContainer>
        ) : (
          <ThumbnailGridContainer data-node-id="4510:4092">
            {paginatedItems.map((item) => (
              <RoadmapCard key={item.id} item={item} />
            ))}
          </ThumbnailGridContainer>
        )}

        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </ListContainer>

      <RoadmapFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

export default RoadmapList;
