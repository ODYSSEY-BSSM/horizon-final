'use client';

import styled from '@emotion/styled';
import { RoadmapCard } from '@/feature/dashboard';
import { FilterTabs, Pagination, RoadmapListItem } from '@/feature/roadmap';
import { tokens } from '@/shared/tokens';
import { Icon, Text, UnderlineButton } from '@/shared/ui';
import type { RoadmapListProps } from './RoadmapList.types';

/**
 * 통합 로드맵 리스트 컴포넌트
 *
 * 모든 페이지에서 재사용 가능한 로드맵 리스트 컴포넌트
 * - 대시보드, 개인 폴더 상세, 팀 폴더 상세에서 사용
 * - 유연한 필터 탭, 뷰 모드, 페이지네이션 설정 가능
 */
const RoadmapList = ({
  items = [],
  viewMode = 'list',
  onViewModeChange,
  showViewToggle = true,
  filterTabs,
  activeFilter,
  onFilterChange,
  showFilterTabs = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPagination = true,
  onAddRoadmap,
  onRoadmapClick,
  title = '로드맵 리스트',
  showHeader = true,
  emptyMessage = '아직 로드맵이 없습니다.',
  className,
}: RoadmapListProps) => {
  const hasRoadmaps = items.length > 0;

  return (
    <StyledContainer className={className}>
      {showHeader && (
        <StyledHeader>
          <StyledHeaderContent>
            <StyledTitle as="h2" variant="H3" color={tokens.colors.neutral[800]}>
              {title}
            </StyledTitle>
            {showViewToggle && (
              <StyledViewToggle>
                <StyledToggleItem
                  $active={viewMode === 'list'}
                  onClick={() => onViewModeChange?.('list')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onViewModeChange?.('list')}
                >
                  <Icon
                    name="list"
                    variant="MD"
                    color={viewMode === 'list' ? tokens.colors.black : tokens.colors.neutral[500]}
                    decorative
                  />
                  <Text
                    as="span"
                    variant="B2"
                    color={
                      viewMode === 'list' ? tokens.colors.neutral[700] : tokens.colors.neutral[500]
                    }
                  >
                    리스트
                  </Text>
                </StyledToggleItem>
                <StyledToggleItem
                  $active={viewMode === 'thumbnail'}
                  onClick={() => onViewModeChange?.('thumbnail')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onViewModeChange?.('thumbnail')}
                >
                  <Icon
                    name="calendar_view_month"
                    variant="MD"
                    color={
                      viewMode === 'thumbnail' ? tokens.colors.black : tokens.colors.neutral[500]
                    }
                    decorative
                  />
                  <Text
                    as="span"
                    variant="B2"
                    color={
                      viewMode === 'thumbnail'
                        ? tokens.colors.neutral[700]
                        : tokens.colors.neutral[500]
                    }
                  >
                    썸네일
                  </Text>
                </StyledToggleItem>
              </StyledViewToggle>
            )}
          </StyledHeaderContent>
        </StyledHeader>
      )}

      {showFilterTabs && filterTabs && filterTabs.length > 0 && activeFilter && onFilterChange && (
        <FilterTabs tabs={filterTabs} activeTab={activeFilter} onTabClick={onFilterChange} />
      )}

      {hasRoadmaps ? (
        <StyledContentSection>
          {viewMode === 'list' ? (
            <StyledRoadmapList>
              {items.map((roadmap) => (
                <RoadmapListItem
                  key={roadmap.id}
                  roadmap={{
                    id: roadmap.id,
                    name: roadmap.title,
                    icon: roadmap.icon,
                    color: roadmap.color,
                    type: roadmap.category,
                    totalSteps: roadmap.steps,
                    completedSteps: Math.floor((roadmap.steps * roadmap.progress) / 100),
                    status: roadmap.status,
                    progress: roadmap.progress,
                  }}
                  onClick={onRoadmapClick}
                />
              ))}
            </StyledRoadmapList>
          ) : (
            <StyledThumbnailGrid>
              {items.map((roadmap) => (
                <RoadmapCard key={roadmap.id} item={roadmap} onClick={onRoadmapClick} />
              ))}
            </StyledThumbnailGrid>
          )}
          {showPagination && totalPages > 1 && (
            <StyledPaginationWrapper>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={
                  onPageChange ||
                  (() => {
                    // No-op if onPageChange is not provided
                  })
                }
              />
            </StyledPaginationWrapper>
          )}
        </StyledContentSection>
      ) : (
        <StyledEmptyState>
          <Text as="p" variant="ST" color={tokens.colors.neutral[600]}>
            {emptyMessage}
          </Text>
          {onAddRoadmap && (
            <UnderlineButton onClick={onAddRoadmap}>새 로드맵 만들기</UnderlineButton>
          )}
        </StyledEmptyState>
      )}
    </StyledContainer>
  );
};

export default RoadmapList;

// Styled Components

const StyledContainer = styled.div`
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  overflow: visible;
  background-color: ${tokens.colors.white};
  position: relative;
`;

const StyledHeader = styled.div`
  padding: ${tokens.spacing.xlarge};
  background-color: ${tokens.colors.white};
`;

const StyledHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitle = styled(Text)`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  letter-spacing: -0.2px;
`;

const StyledViewToggle = styled.div`
  display: flex;
  background-color: ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.xxsmall};
`;

const StyledToggleItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  padding: ${tokens.spacing.xxsmall} ${tokens.spacing.xsmall};
  border-radius: ${tokens.radius.small};
  background-color: ${({ $active }) => ($active ? tokens.colors.white : 'transparent')};
  cursor: pointer;

  span {
    font-weight: ${tokens.typos.fontWeight.semibold};
  }
`;

const StyledContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xlarge};
  padding: ${tokens.spacing.xlarge};
  background-color: ${tokens.colors.white};
  overflow: visible;
`;

const StyledRoadmapList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 944px;
  overflow: visible;
`;

const StyledThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 246px);
  gap: ${tokens.spacing.medium};
  max-height: 1032px;
  overflow: visible;
`;

const StyledPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 80px ${tokens.spacing.xlarge};
  background-color: ${tokens.colors.white};
`;
