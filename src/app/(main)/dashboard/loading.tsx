import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function DashboardLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[200]}
      highlightColor={tokens.colors.neutral[100]}
    >
      <PageContainer>
        {/* Header Skeleton */}
        <HeaderContainer>
          <Skeleton height={48} width={240} />
          <Skeleton height={48} width={300} />
        </HeaderContainer>

        <ContentContainer>
          {/* Greeting Section Skeleton */}
          <GreetingContainer>
            <Skeleton height={32} width={250} />
          </GreetingContainer>

          {/* Info Cards Grid Skeleton */}
          <InfoCardsContainer>
            {Array.from({ length: 5 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't need stable keys
              <InfoCardSkeleton key={i}>
                <Skeleton height={24} width={120} />
                <Skeleton height={20} width={60} />
                <Skeleton height={16} width={80} />
              </InfoCardSkeleton>
            ))}
          </InfoCardsContainer>

          {/* Roadmap Section Skeleton */}
          <RoadmapContainer>
            <RoadmapHeaderSkeleton>
              <Skeleton height={28} width={200} />
              <Skeleton height={40} width={120} />
            </RoadmapHeaderSkeleton>

            <RoadmapGridSkeleton>
              {Array.from({ length: 6 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't need stable keys
                <RoadmapCardSkeleton key={i}>
                  <RoadmapCardTop>
                    <Skeleton height={16} width={80} />
                    <Skeleton circle width={24} height={24} />
                  </RoadmapCardTop>
                  <RoadmapCardContent>
                    <Skeleton height={20} width={150} />
                    <Skeleton height={14} width={100} />
                    <Skeleton height={12} width={200} />
                  </RoadmapCardContent>
                  <RoadmapCardFooter>
                    <Skeleton height={14} width={60} />
                    <Skeleton height={14} width={80} />
                  </RoadmapCardFooter>
                </RoadmapCardSkeleton>
              ))}
            </RoadmapGridSkeleton>
          </RoadmapContainer>
        </ContentContainer>
      </PageContainer>
    </SkeletonTheme>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  padding: 0 60px 80px;
  box-sizing: border-box;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.spacing.large} 0;
  margin-bottom: ${tokens.spacing.large};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxlarge};
  width: 1080px;
`;

const GreetingContainer = styled.div`
  margin-bottom: ${tokens.spacing.medium};
`;

const InfoCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${tokens.spacing.large};
`;

const InfoCardSkeleton = styled.div`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  padding: ${tokens.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  height: 120px;
`;

const RoadmapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const RoadmapHeaderSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RoadmapGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${tokens.spacing.large};
`;

const RoadmapCardSkeleton = styled.div`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  padding: ${tokens.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
  height: 200px;
`;

const RoadmapCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RoadmapCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  flex: 1;
`;

const RoadmapCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
