'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function MyRoadmapsLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[100]}
      highlightColor={tokens.colors.neutral[200]}
    >
      <StyledPageContainer>
        <StyledHeaderSkeleton>
          <Skeleton height={34} width={240} />
          <Skeleton height={48} width={120} />
        </StyledHeaderSkeleton>
        <StyledFolderSectionSkeleton>
          <StyledFolderHeaderSkeleton>
            <Skeleton height={28} width={160} />
            <Skeleton height={24} width={80} />
          </StyledFolderHeaderSkeleton>
          <StyledFolderGridSkeleton>
            {Array.from({ length: 4 }).map((_, i) => (
              <StyledFolderCardSkeleton key={i}>
                <Skeleton height={24} width={180} />
                <Skeleton height={16} width={120} />
                <Skeleton height={40} width={40} />
              </StyledFolderCardSkeleton>
            ))}
          </StyledFolderGridSkeleton>
        </StyledFolderSectionSkeleton>
      </StyledPageContainer>
    </SkeletonTheme>
  );
}

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 14px 60px 80px;
  box-sizing: border-box;
`;

const StyledHeaderSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledFolderSectionSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledFolderHeaderSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledFolderGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const StyledFolderCardSkeleton = styled.div`
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 200px;
`;
