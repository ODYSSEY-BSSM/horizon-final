'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import PageHeader from './_components/PageHeader';
import { useFilter } from './_hooks/useFilter';
import { usePagination } from './_hooks/usePagination';
import { useRoadmapData } from './_hooks/useRoadmapData';
import { useViewMode } from './_hooks/useViewMode';
import RoadmapListSection from './_sections/RoadmapListSection';
import type { Roadmap } from './_types';

const FolderContent = () => {
  const { viewMode, setViewMode } = useViewMode();
  const { activeFilter, setFilter } = useFilter();

  // Get initial data for pagination setup
  const initialData = useRoadmapData({
    filter: activeFilter,
    viewMode,
    currentPage: 1,
  });

  // Setup pagination
  const { paginationState, goToPage, goToNextPage, goToPrevPage, resetPage } = usePagination({
    totalItems: initialData.totalItems,
    itemsPerPage: initialData.itemsPerPage,
  });

  // Get paginated roadmap data
  const { roadmaps: paginatedRoadmaps, isEmpty: isEmptyPaginated } = useRoadmapData({
    filter: activeFilter,
    viewMode,
    currentPage: paginationState.currentPage,
  });

  // Reset to first page when filter or view mode changes
  const handleFilterChange = (newFilter: typeof activeFilter) => {
    setFilter(newFilter);
    resetPage();
  };

  const handleViewModeChange = (newMode: typeof viewMode) => {
    setViewMode(newMode);
    resetPage();
  };

  const handleAddRoadmap = () => {
    // TODO: Implement roadmap creation modal
  };

  const handleRoadmapClick = (roadmap: Roadmap) => {
    // TODO: Navigate to roadmap detail page
    void roadmap;
  };

  const handleRoadmapMenuClick = (roadmap: Roadmap) => {
    // TODO: Show roadmap options menu
    void roadmap;
  };

  return (
    <StyledPageContainer>
      <StyledContentContainer>
        <PageHeader onAddClick={handleAddRoadmap} />

        <RoadmapListSection
          roadmaps={paginatedRoadmaps}
          isEmpty={isEmptyPaginated}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          paginationState={paginationState}
          onPageChange={goToPage}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
          onAddRoadmap={handleAddRoadmap}
          onRoadmapClick={handleRoadmapClick}
          onRoadmapMenuClick={handleRoadmapMenuClick}
        />
      </StyledContentContainer>
    </StyledPageContainer>
  );
};

export default FolderContent;

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  padding: 0 60px 80px;
  box-sizing: border-box;
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  width: 100%;
`;
