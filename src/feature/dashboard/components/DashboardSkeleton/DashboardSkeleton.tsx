'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

const DashboardSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[200]}
      highlightColor={tokens.colors.neutral[100]}
    >
      <StyledContainer>
        {/* Greeting Section Skeleton */}
        <StyledGreetingSection>
          <Skeleton width={120} height={26} borderRadius={8} />
          <Skeleton width={240} height={34} borderRadius={8} />
        </StyledGreetingSection>

        {/* Info Cards Grid Skeleton */}
        <StyledInfoCardsGrid>
          {Array.from({ length: 3 }).map((_, index) => (
            <StyledInfoCard key={`info-card-${index}`}>
              <StyledInfoCardContent>
                <StyledInfoCardText>
                  <Skeleton width={80} height={20} borderRadius={8} />
                  <Skeleton width={140} height={32} borderRadius={8} />
                  <Skeleton width={200} height={20} borderRadius={8} />
                </StyledInfoCardText>
                <Skeleton width={80} height={88} borderRadius={8} />
              </StyledInfoCardContent>
            </StyledInfoCard>
          ))}
        </StyledInfoCardsGrid>

        {/* Roadmap Section Skeleton */}
        <StyledRoadmapSection>
          <StyledRoadmapHeader>
            <StyledRoadmapHeaderLeft>
              <Skeleton width={160} height={32} borderRadius={8} />
              <StyledTabsContainer>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={`tab-${index}`} width={80} height={20} borderRadius={8} />
                ))}
              </StyledTabsContainer>
            </StyledRoadmapHeaderLeft>
            <Skeleton width={160} height={48} borderRadius={8} />
          </StyledRoadmapHeader>

          <StyledRoadmapList>
            {Array.from({ length: 4 }).map((_, index) => (
              <StyledRoadmapItem key={`roadmap-${index}`}>
                <Skeleton width={48} height={48} borderRadius={8} />
                <StyledRoadmapItemContent>
                  <Skeleton width={80} height={16} borderRadius={8} />
                  <Skeleton width={400} height={20} borderRadius={8} />
                </StyledRoadmapItemContent>
              </StyledRoadmapItem>
            ))}
          </StyledRoadmapList>
        </StyledRoadmapSection>
      </StyledContainer>
    </SkeletonTheme>
  );
};

export default DashboardSkeleton;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxlarge};
  width: 100%;
`;

const StyledGreetingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 240px;
`;

const StyledInfoCardsGrid = styled.div`
  display: flex;
  gap: ${tokens.spacing.large};
  width: 100%;
`;

const StyledInfoCard = styled.div`
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  height: 136px;
  width: 344px;
  position: relative;
  overflow: hidden;
`;

const StyledInfoCardContent = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.large};
`;

const StyledInfoCardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 200px;
`;

const StyledRoadmapSection = styled.div`
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  height: 476px;
  position: relative;
  overflow: hidden;
`;

const StyledRoadmapHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.spacing.large};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
  height: 140px;
  box-sizing: border-box;
`;

const StyledRoadmapHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  width: 464px;
`;

const StyledTabsContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
`;

const StyledRoadmapList = styled.div`
  display: flex;
  flex-direction: column;
  height: 288px;
  justify-content: space-between;
  padding: ${tokens.spacing.large};
`;

const StyledRoadmapItem = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
`;

const StyledRoadmapItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;
