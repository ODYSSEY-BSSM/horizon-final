'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import type { Roadmap } from '@/feature/roadmap';
import { FilterTabs, RoadmapListItem } from '@/feature/roadmap';
import { ROADMAP_FILTER_TABS } from '@/feature/team';
import type { Roadmap as TeamRoadmap } from '@/feature/team/types/team';
import { tokens } from '@/shared/tokens';
import { Icon, Text } from '@/shared/ui';

interface RoadmapListContainerProps {
  roadmaps: TeamRoadmap[];
  onRoadmapClick: (roadmap: TeamRoadmap) => void;
  onCreateRoadmap?: () => void;
}

const RoadmapListContainer = ({
  roadmaps,
  onRoadmapClick,
  onCreateRoadmap,
}: RoadmapListContainerProps) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledHeaderContent>
          <StyledTitle as="h2" variant="H3" color={tokens.colors.neutral[800]}>
            로드맵 리스트
          </StyledTitle>
          <StyledViewToggle>
            <StyledToggleItem
              $active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setViewMode('list')}
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
              onClick={() => setViewMode('thumbnail')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setViewMode('thumbnail')}
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

      <FilterTabs tabs={ROADMAP_FILTER_TABS} activeTab={activeTab} onTabClick={setActiveTab} />

      {roadmaps.length > 0 ? (
        <StyledContent>
          <StyledRoadmapList>
            {roadmaps.map((roadmap) => {
              const unifiedRoadmap: Roadmap = {
                id: roadmap.id,
                name: roadmap.name,
                description: roadmap.description,
                icon: roadmap.icon || 'deployed_code',
                color: roadmap.color || 'blue',
                type: roadmap.type || 'team',
                totalSteps: roadmap.totalSteps || 0,
                completedSteps: roadmap.completedSteps || 0,
                status: roadmap.status || 'in-progress',
                progress: roadmap.progress || 0,
                folderId: roadmap.folderId,
                createdAt: roadmap.createdAt,
                updatedAt: roadmap.updatedAt,
              };
              return (
                <RoadmapListItem
                  key={roadmap.id}
                  roadmap={unifiedRoadmap}
                  onClick={() => onRoadmapClick(roadmap)}
                />
              );
            })}
          </StyledRoadmapList>
        </StyledContent>
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

export default RoadmapListContainer;

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

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background-color: ${tokens.colors.white};
`;

const StyledRoadmapList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 944px;
  overflow-y: auto;
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
