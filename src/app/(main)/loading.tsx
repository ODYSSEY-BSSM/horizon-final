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
      <MainLayoutContainer>
        <SidebarSkeleton>
          <SidebarHeader>
            <Skeleton height={32} width={120} />
          </SidebarHeader>
          <SidebarNav>
            {Array.from({ length: 5 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't need stable keys
              <NavItemSkeleton key={i}>
                <Skeleton circle width={24} height={24} />
                <Skeleton height={16} width={80} />
              </NavItemSkeleton>
            ))}
          </SidebarNav>
        </SidebarSkeleton>

        <MainContentSkeleton>
          <ContentPadding>
            <HeaderSkeleton>
              <Skeleton height={48} width={240} />
              <Skeleton height={48} width={300} />
            </HeaderSkeleton>

            <ContentArea>
              <Skeleton height={32} width={250} />
              <Skeleton height={120} width="100%" />
              <ContentGrid>
                {Array.from({ length: 6 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't need stable keys
                  <ContentCardSkeleton key={i}>
                    <Skeleton height={20} width={150} />
                    <Skeleton height={16} width={100} />
                    <Skeleton height={80} />
                  </ContentCardSkeleton>
                ))}
              </ContentGrid>
            </ContentArea>
          </ContentPadding>
        </MainContentSkeleton>
      </MainLayoutContainer>
    </SkeletonTheme>
  );
}

const MainLayoutContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const SidebarSkeleton = styled.div`
  width: 280px;
  background-color: ${tokens.colors.white};
  border-right: 1px solid ${tokens.colors.neutral[200]};
  padding: ${tokens.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const SidebarHeader = styled.div`
  padding-bottom: ${tokens.spacing.medium};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
`;

const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
`;

const NavItemSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.small};
`;

const MainContentSkeleton = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: ${tokens.colors.white};
`;

const ContentPadding = styled.div`
  padding: 0 60px 80px;
  box-sizing: border-box;
`;

const HeaderSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.spacing.large} 0;
  margin-bottom: ${tokens.spacing.large};
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxlarge};
  width: 1080px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${tokens.spacing.large};
`;

const ContentCardSkeleton = styled.div`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  padding: ${tokens.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  height: 180px;
`;
