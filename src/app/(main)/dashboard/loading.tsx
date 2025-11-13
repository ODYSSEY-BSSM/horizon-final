'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function DashboardLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[100]}
      highlightColor={tokens.colors.neutral[200]}
    >
      <StyledPageContainer>
        <StyledContentContainer>
          <StyledGreetingContainer>
            <Skeleton height={32} width={250} />
          </StyledGreetingContainer>

          <StyledInfoCardsContainer>
            {Array.from({ length: 5 }).map((_, i) => (
              <StyledInfoCardSkeleton key={i}>
                <Skeleton height={24} width={120} />
                <Skeleton height={20} width={60} />
                <Skeleton height={16} width={80} />
              </StyledInfoCardSkeleton>
            ))}
          </StyledInfoCardsContainer>

          <StyledRoadmapContainer>
            <StyledRoadmapHeaderSkeleton>
              <Skeleton height={28} width={200} />
              <Skeleton height={40} width={120} />
            </StyledRoadmapHeaderSkeleton>

            <StyledRoadmapGridSkeleton>
              {Array.from({ length: 6 }).map((_, i) => (
                <StyledRoadmapCardSkeleton key={i}>
                  <StyledRoadmapCardTop>
                    <Skeleton height={16} width={80} />
                    <Skeleton circle width={24} height={24} />
                  </StyledRoadmapCardTop>
                  <StyledRoadmapCardContent>
                    <Skeleton height={20} width={150} />
                    <Skeleton height={14} width={100} />
                    <Skeleton height={12} width={200} />
                  </StyledRoadmapCardContent>
                  <StyledRoadmapCardFooter>
                    <Skeleton height={14} width={60} />
                    <Skeleton height={14} width={80} />
                  </StyledRoadmapCardFooter>
                </StyledRoadmapCardSkeleton>
              ))}
            </StyledRoadmapGridSkeleton>
          </StyledRoadmapContainer>
        </StyledContentContainer>
      </StyledPageContainer>
    </SkeletonTheme>
  );
}

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
  gap: ${tokens.spacing.xxlarge};
  width: 100%;
`;

const StyledGreetingContainer = styled.div`
  margin-top: 48px;
  margin-bottom: ${tokens.spacing.medium};
`;

const StyledInfoCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${tokens.spacing.large};
`;

const StyledInfoCardSkeleton = styled.div`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  padding: ${tokens.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  height: 120px;
`;

const StyledRoadmapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const StyledRoadmapHeaderSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledRoadmapGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(333px, 1fr));
  gap: ${tokens.spacing.large};
`;

const StyledRoadmapCardSkeleton = styled.div`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  padding: ${tokens.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
  height: 200px;
`;

const StyledRoadmapCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledRoadmapCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  flex: 1;
`;

const StyledRoadmapCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
