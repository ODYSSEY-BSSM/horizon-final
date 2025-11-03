'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import EmptyState from '../_components/EmptyState';
import FilterTab from '../_components/FilterTab';
import ListHeader from '../_components/ListHeader';
import Pagination from '../_components/Pagination';
import RoadmapCardItem from '../_components/RoadmapCardItem';
import RoadmapListItem from '../_components/RoadmapListItem';
import type { FilterType, PaginationState, Roadmap, ViewMode } from '../_types';

interface RoadmapListSectionProps {
  roadmaps: Roadmap[];
  isEmpty: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  paginationState: PaginationState;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onAddRoadmap?: () => void;
  onRoadmapClick?: (roadmap: Roadmap) => void;
  onRoadmapMenuClick?: (roadmap: Roadmap) => void;
  className?: string;
}

const RoadmapListSection = ({
  roadmaps,
  isEmpty,
  viewMode,
  onViewModeChange,
  activeFilter,
  onFilterChange,
  paginationState,
  onPageChange,
  onNextPage,
  onPrevPage,
  onAddRoadmap,
  onRoadmapClick,
  onRoadmapMenuClick,
  className,
}: RoadmapListSectionProps) => {
  return (
    <StyledContainer className={className}>
      <StyledHeaderSection>
        <ListHeader
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onAddClick={onAddRoadmap}
        />
        <FilterTab activeFilter={activeFilter} onFilterChange={onFilterChange} />
      </StyledHeaderSection>

      <StyledContentSection>
        {isEmpty ? (
          <EmptyState onCreateClick={onAddRoadmap} />
        ) : viewMode === 'list' ? (
          <StyledListView>
            {roadmaps.map((roadmap) => (
              <RoadmapListItem
                key={roadmap.id}
                roadmap={roadmap}
                onClick={() => onRoadmapClick?.(roadmap)}
                onMenuClick={() => onRoadmapMenuClick?.(roadmap)}
              />
            ))}
          </StyledListView>
        ) : (
          <StyledCardView>
            {roadmaps.map((roadmap) => (
              <RoadmapCardItem
                key={roadmap.id}
                roadmap={roadmap}
                onClick={() => onRoadmapClick?.(roadmap)}
                onMenuClick={() => onRoadmapMenuClick?.(roadmap)}
              />
            ))}
          </StyledCardView>
        )}
      </StyledContentSection>

      {!isEmpty && paginationState.totalPages > 1 && (
        <StyledPaginationSection>
          <Pagination
            paginationState={paginationState}
            onPageChange={onPageChange}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
          />
        </StyledPaginationSection>
      )}
    </StyledContainer>
  );
};

export default RoadmapListSection;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: 12px;
  overflow: hidden;
`;

const StyledHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledContentSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  min-height: 278px;
`;

const StyledListView = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${tokens.spacing.large};
  gap: ${tokens.spacing.small};
`;

const StyledCardView = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 246px);
  gap: ${tokens.spacing.large};
  padding: ${tokens.spacing.large};
  justify-content: flex-start;
`;

const StyledPaginationSection = styled.div`
  display: flex;
  justify-content: center;
  padding: ${tokens.spacing.medium} ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
`;
