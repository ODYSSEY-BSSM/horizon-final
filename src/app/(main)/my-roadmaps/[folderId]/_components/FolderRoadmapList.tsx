'use client';

import styled from '@emotion/styled';
import RoadmapCard from '@/app/(main)/dashboard/_components/RoadmapCard';
import { Icon } from '@/shared/ui';
import { Text } from '@/shared/ui';
import type { RoadmapItem } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';
import type { MockRoadmap } from '../_data/mockData';
import FolderFilterTabs from './FolderFilterTabs';
import { Pagination } from '@/feature/roadmap';
import { RoadmapListItem } from '@/feature/roadmap';

export interface FolderRoadmapListProps {
  className?: string;
  viewMode?: 'list' | 'thumbnail';
  onViewModeChange?: (mode: 'list' | 'thumbnail') => void;
  onCreateRoadmap?: () => void;
  activeTab: string;
  onTabClick: (value: string) => void;
  roadmaps?: MockRoadmap[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const FolderRoadmapList = ({
  className,
  viewMode = 'list',
  onViewModeChange,
  onCreateRoadmap,
  activeTab,
  onTabClick,
  roadmaps = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: FolderRoadmapListProps) => {
  const hasRoadmaps = roadmaps.length > 0;

  return (
    <StyledContainer className={className}>
      <StyledHeader>
        <StyledHeaderContent>
          <StyledTitle as="h2" variant="H3" color={tokens.colors.neutral[800]}>
            로드맵 리스트
          </StyledTitle>
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
                color={viewMode === 'thumbnail' ? tokens.colors.black : tokens.colors.neutral[500]}
                decorative
              />
              <Text
                as="span"
                variant="B2"
                color={
                  viewMode === 'thumbnail' ? tokens.colors.neutral[700] : tokens.colors.neutral[500]
                }
              >
                썸네일
              </Text>
            </StyledToggleItem>
          </StyledViewToggle>
        </StyledHeaderContent>
      </StyledHeader>

      <FolderFilterTabs activeTab={activeTab} onTabClick={onTabClick} />

      {hasRoadmaps ? (
        <StyledContentSection>
          {viewMode === 'list' ? (
            <StyledRoadmapList>
              {roadmaps.map((roadmap) => (
                <RoadmapListItem
                  key={roadmap.id}
                  roadmap={{
                    id: roadmap.id,
                    name: roadmap.title,
                    icon: roadmap.icon,
                    color: roadmap.color,
                    type: roadmap.type === 'my' ? 'personal' : 'team',
                    totalSteps: Math.floor(Math.random() * 20) + 5,
                    completedSteps: Math.floor((Math.random() * 20 + 5) * roadmap.progress / 100),
                    status: roadmap.progress === 100 ? 'completed' : 'in-progress',
                    progress: roadmap.progress,
                  }}
                />
              ))}
            </StyledRoadmapList>
          ) : (
            <StyledThumbnailGrid>
              {roadmaps.map((roadmap) => {
                const roadmapItem: RoadmapItem = {
                  id: roadmap.id,
                  title: roadmap.title,
                  icon: roadmap.icon,
                  color: roadmap.color,
                  category: roadmap.type === 'my' ? 'personal' : 'team',
                  steps: 0,
                  status: roadmap.progress === 100 ? 'completed' : 'in-progress',
                  progress: roadmap.progress,
                };
                return <RoadmapCard key={roadmap.id} item={roadmapItem} />;
              })}
            </StyledThumbnailGrid>
          )}
          <StyledPaginationWrapper>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={
                onPageChange ||
                (() => {
                  /* no-op */
                })
              }
            />
          </StyledPaginationWrapper>
        </StyledContentSection>
      ) : (
        <StyledEmptyState>
          <Text as="p" variant="ST" color={tokens.colors.neutral[600]}>
            아직 로드맵이 없습니다.
          </Text>
          <StyledCreateLink
            as="button"
            variant="B1"
            color={tokens.colors.primary[500]}
            onClick={onCreateRoadmap}
          >
            새 로드맵 만들기
          </StyledCreateLink>
        </StyledEmptyState>
      )}
    </StyledContainer>
  );
};

export default FolderRoadmapList;

const StyledContainer = styled.div`
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  overflow: hidden;
  background-color: ${tokens.colors.white};
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
`;

const StyledRoadmapList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 944px;
`;

const StyledThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 246px);
  gap: ${tokens.spacing.medium};
  max-height: 1032px;
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

const StyledCreateLink = styled(Text)`
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-weight: ${tokens.typos.fontWeight.semibold};

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;
