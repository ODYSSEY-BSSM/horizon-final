'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function TeamSpaceLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[100]}
      highlightColor={tokens.colors.neutral[200]}
    >
      <StyledContainer>
        <StyledHeader>
          <Skeleton height={48} width={200} />
          <StyledButtonGroup>
            <Skeleton height={48} width={120} />
            <Skeleton height={48} width={120} />
          </StyledButtonGroup>
        </StyledHeader>
        <StyledFolderGrid>
          <StyledTabSkeleton>
            <Skeleton height={24} width={80} />
            <Skeleton height={24} width={80} />
          </StyledTabSkeleton>
          <StyledFolderCardContainer>
            {Array.from({ length: 4 }).map((_, i) => (
              <StyledFolderCardSkeleton key={i}>
                <Skeleton height={24} width={180} />
                <Skeleton height={16} width={120} />
                <Skeleton height={40} width={40} />
              </StyledFolderCardSkeleton>
            ))}
          </StyledFolderCardContainer>
        </StyledFolderGrid>
      </StyledContainer>
    </SkeletonTheme>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 16px 60px 80px;
  box-sizing: border-box;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const StyledFolderGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledTabSkeleton = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
`;

const StyledFolderCardContainer = styled.div`
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
