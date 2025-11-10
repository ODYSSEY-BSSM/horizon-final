'use client';

import styled from '@emotion/styled';
import { FILTER_TABS, FilterTabs } from '@/feature/roadmap';
import { tokens } from '@/shared/tokens';
import { Icon, Text } from '@/shared/ui';

export interface RoadmapListProps {
  className?: string;
  viewMode?: 'list' | 'thumbnail';
  onViewModeChange?: (mode: 'list' | 'thumbnail') => void;
  onCreateRoadmap?: () => void;
  activeTab: string;
  onTabClick: (value: string) => void;
}

const RoadmapList = ({
  className,
  viewMode = 'list',
  onViewModeChange,
  onCreateRoadmap,
  activeTab,
  onTabClick,
}: RoadmapListProps) => {
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
                variant="B1"
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
                variant="B1"
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

      <FilterTabs tabs={FILTER_TABS} activeTab={activeTab} onTabClick={onTabClick} />

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
    </StyledContainer>
  );
};

export default RoadmapList;

const StyledContainer = styled.div`
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  overflow: hidden;
  background-color: ${tokens.colors.white};
`;

const StyledHeader = styled.div`
  padding: ${tokens.spacing.large};
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
`;

const _StyledFilterTabs = styled.div`
  display: flex;
  gap: ${tokens.spacing.large};
  padding: 0 ${tokens.spacing.large};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
`;

const _StyledFilterTab = styled.div<{ $active?: boolean }>`
  padding: ${tokens.spacing.small} ${tokens.spacing.xxsmall};
  border-bottom: 2px solid ${({ $active }) => ($active ? tokens.colors.primary[500] : 'transparent')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.xxxlarge} ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
`;

const StyledCreateLink = styled(Text)`
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font: inherit;

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;
