'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function FolderDetailLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[100]}
      highlightColor={tokens.colors.neutral[200]}
    >
      <StyledPageContainer>
        <StyledTitleRow>
          <Skeleton height={34} width={240} />
          <Skeleton height={48} width={120} />
        </StyledTitleRow>
        <StyledRoadmapGrid>
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
        </StyledRoadmapGrid>
      </StyledPageContainer>
    </SkeletonTheme>
  );
}

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 16px 60px 80px;
  box-sizing: border-box;
`;

const StyledTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledRoadmapGrid = styled.div`
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
