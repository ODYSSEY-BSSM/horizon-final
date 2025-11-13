'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function SchoolConnectLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[100]}
      highlightColor={tokens.colors.neutral[200]}
    >
      <StyledPageContainer>
        <StyledHeaderSkeleton>
          <Skeleton height={34} width={240} />
        </StyledHeaderSkeleton>
        <StyledSchoolInfoSkeleton>
          <Skeleton height={24} width={150} />
          <Skeleton height={16} width={250} />
          <Skeleton height={40} width={100} />
        </StyledSchoolInfoSkeleton>
        <StyledNodeListSectionSkeleton>
          <StyledNodeListHeaderSkeleton>
            <Skeleton height={28} width={180} />
          </StyledNodeListHeaderSkeleton>
          <StyledNodeGridSkeleton>
            {Array.from({ length: 8 }).map((_, i) => (
              <StyledNodeCardSkeleton key={i}>
                <Skeleton height={20} width={'80%'} />
                <Skeleton height={14} width={'60%'} />
                <Skeleton height={14} width={'90%'} />
              </StyledNodeCardSkeleton>
            ))}
          </StyledNodeGridSkeleton>
          <StyledPaginationSkeleton>
            <Skeleton height={32} width={200} />
          </StyledPaginationSkeleton>
        </StyledNodeListSectionSkeleton>
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

const StyledSchoolInfoSkeleton = styled.div`
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const StyledNodeListSectionSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledNodeListHeaderSkeleton = styled.div`
  display: flex;
`;

const StyledNodeGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const StyledNodeCardSkeleton = styled.div`
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 150px;
`;

const StyledPaginationSkeleton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 24px;
`;
