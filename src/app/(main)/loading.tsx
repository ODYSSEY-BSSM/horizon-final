import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function MainLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[200]}
      highlightColor={tokens.colors.neutral[100]}
    >
      <StyledMainLayoutContainer>
        <StyledSidebarSkeleton>
          <StyledSidebarHeader>
            <Skeleton height={32} width={120} />
          </StyledSidebarHeader>
          <StyledSidebarNav>
            {Array.from({ length: 5 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't need stable keys
              <StyledNavItemSkeleton key={i}>
                <Skeleton circle width={24} height={24} />
                <Skeleton height={16} width={80} />
              </StyledNavItemSkeleton>
            ))}
          </StyledSidebarNav>
        </StyledSidebarSkeleton>

        <StyledMainContentSkeleton>
          <StyledContentPadding>
            <StyledHeaderSkeleton>
              <Skeleton height={48} width={240} />
              <Skeleton height={48} width={300} />
            </StyledHeaderSkeleton>

            <StyledContentArea>
              <Skeleton height={32} width={250} />
              <Skeleton height={120} width="100%" />
              <StyledContentGrid>
                {Array.from({ length: 6 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't need stable keys
                  <StyledContentCardSkeleton key={i}>
                    <Skeleton height={20} width={150} />
                    <Skeleton height={16} width={100} />
                    <Skeleton height={80} />
                  </StyledContentCardSkeleton>
                ))}
              </StyledContentGrid>
            </StyledContentArea>
          </StyledContentPadding>
        </StyledMainContentSkeleton>
      </StyledMainLayoutContainer>
    </SkeletonTheme>
  );
}

const StyledMainLayoutContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const StyledSidebarSkeleton = styled.div`
  width: 280px;
  background-color: ${tokens.colors.white};
  border-right: 1px solid ${tokens.colors.neutral[200]};
  padding: ${tokens.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const StyledSidebarHeader = styled.div`
  padding-bottom: ${tokens.spacing.medium};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
`;

const StyledSidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
`;

const StyledNavItemSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.small};
`;

const StyledMainContentSkeleton = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: ${tokens.colors.white};
`;

const StyledContentPadding = styled.div`
  padding: 0 60px 80px;
  box-sizing: border-box;
`;

const StyledHeaderSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.spacing.large} 0;
  margin-bottom: ${tokens.spacing.large};
`;

const StyledContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxlarge};
  width: 1080px;
`;

const StyledContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${tokens.spacing.large};
`;

const StyledContentCardSkeleton = styled.div`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  padding: ${tokens.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  height: 180px;
`;
