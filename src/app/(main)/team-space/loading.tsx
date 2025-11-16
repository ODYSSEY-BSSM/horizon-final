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
      <StyledPageContainer>
        {/* 헤더 스켈레톤 */}
        <StyledHeaderSkeleton>
          <Skeleton width={200} height={34} />
        </StyledHeaderSkeleton>

        {/* 팀 카드 그리드 스켈레톤 */}
        <StyledTeamGrid>
          {Array.from({ length: 3 }).map((_, index) => (
            <StyledTeamCardSkeleton key={index}>
              {/* 팀 아이콘 */}
              <StyledIconSkeleton>
                <Skeleton circle width={40} height={40} />
              </StyledIconSkeleton>

              {/* 팀 정보 */}
              <StyledTeamInfoSkeleton>
                <Skeleton width={100} height={20} />
                <Skeleton width={148} height={12} />
              </StyledTeamInfoSkeleton>

              {/* 팀 메타데이터 */}
              <StyledMetadataSkeleton>
                <Skeleton width={64} height={16} />
                <Skeleton width={64} height={16} />
              </StyledMetadataSkeleton>

              {/* 멤버 수와 화살표 */}
              <StyledFooterSkeleton>
                <Skeleton width={168} height={16} />
                <Skeleton width={20} height={20} />
              </StyledFooterSkeleton>
            </StyledTeamCardSkeleton>
          ))}
        </StyledTeamGrid>
      </StyledPageContainer>
    </SkeletonTheme>
  );
}

const StyledPageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${tokens.spacing.xlarge};
`;

const StyledHeaderSkeleton = styled.div`
  margin-bottom: ${tokens.spacing.xlarge};
`;

const StyledTeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(333px, 1fr));
  gap: ${tokens.spacing.medium};
`;

const StyledTeamCardSkeleton = styled.div`
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
`;

const StyledIconSkeleton = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTeamInfoSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledMetadataSkeleton = styled.div`
  display: flex;
  gap: ${tokens.spacing.small};
`;

const StyledFooterSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
