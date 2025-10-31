'use client';

import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import type { FilterType, RoadmapItem, ViewType } from '@/lib/types/dashboard';
import type { RoadmapFormData } from '@/lib/types/modal';
import { tokens } from '@/shared/tokens';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_THUMBNAIL } from '../_constants/RoadmapList.constants';
import RoadmapFormModal from '../_forms/RoadmapFormModal/RoadmapFormModal';
import FilterTab from './FilterTab';
import ListHeader from './ListHeader';
import Pagination from './Pagination';
import RoadmapCard from './RoadmapCard';
import RoadmapListItem from './RoadmapListItem';

export interface RoadmapListProps {
  className?: string;
  items?: RoadmapItem[];
  onAddRoadmap?: (data?: RoadmapFormData) => void;
  onViewChange?: (view: ViewType) => void;
  onFilterChange?: (filter: FilterType) => void;
  onPageChange?: (page: number) => void;
}

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
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterType) => {
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

  const handleModalSubmit = (data: RoadmapFormData) => {
    onAddRoadmap(data);
    setIsModalOpen(false);
  };

  return (
    <>
      <StyledListContainer className={className}>
        <ListHeader
          currentView={currentView}
          onViewChange={handleViewChangeInternal}
          onAddRoadmap={handleAddRoadmapClick}
        />
        <FilterTab currentFilter={currentFilter} onFilterChange={handleFilterChangeInternal} />

        {currentView === 'list' ? (
          <StyledListItemsContainer>
            {paginatedItems.map((item) => (
              <RoadmapListItem key={item.id} item={item} />
            ))}
          </StyledListItemsContainer>
        ) : (
          <StyledThumbnailGridContainer>
            {paginatedItems.map((item) => (
              <RoadmapCard key={item.id} item={item} />
            ))}
          </StyledThumbnailGridContainer>
        )}

        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </StyledListContainer>

      <RoadmapFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

export default RoadmapList;

const StyledListContainer = styled.div`
  width: 1080px;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  overflow: hidden;
  box-shadow: ${tokens.shadow[0]};
`;

const StyledListItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  padding: ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
  max-height: 944px;
`;

const StyledThumbnailGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 246px);
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
`;
