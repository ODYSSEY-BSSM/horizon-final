'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';
import type { SkeletonViewProps } from './SkeletonView.types';

const SkeletonView = ({
  cardCount = 3,
  className,
  showContentBorder = true,
}: SkeletonViewProps) => {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[100]}
      highlightColor={tokens.colors.neutral[200]}
    >
      <StyledContainer className={className}>
        <StyledHeader>
          <Skeleton width={240} height={34} />
          <Skeleton width={120} height={48} />
        </StyledHeader>

        <StyledContent $showBorder={showContentBorder}>
          <StyledSkeletonTitleSection>
            <Skeleton width={160} height={20} />
            <Skeleton width={280} height={20} />
          </StyledSkeletonTitleSection>

          <StyledSkeletonCardsGrid>
            {Array.from({ length: cardCount }).map((_, index) => (
              <StyledSkeletonCard key={index}>
                <Skeleton width={40} height={40} />
                <StyledSkeletonCardContent>
                  <Skeleton width={100} height={20} />
                  <Skeleton width={148} height={12} />
                </StyledSkeletonCardContent>
                <StyledSkeletonCardFooter>
                  <StyledSkeletonCardStats>
                    <Skeleton width={64} height={16} />
                    <Skeleton width={64} height={16} />
                  </StyledSkeletonCardStats>
                  <Skeleton width={168} height={16} style={{ alignSelf: 'flex-end' }} />
                </StyledSkeletonCardFooter>
              </StyledSkeletonCard>
            ))}
          </StyledSkeletonCardsGrid>
        </StyledContent>
      </StyledContainer>
    </SkeletonTheme>
  );
};

export default SkeletonView;

const StyledContainer = styled.div`
  width: 100%;
  padding: ${tokens.spacing.large};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.xlarge};
`;

const StyledContent = styled.div<{ $showBorder: boolean }>`
  ${({ $showBorder }) =>
    $showBorder
      ? `
    background-color: ${tokens.colors.white};
    border: 1px solid ${tokens.colors.neutral[100]};
    border-radius: ${tokens.radius.large};
    padding: ${tokens.spacing.large};
  `
      : `
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing.large};
  `}
`;

const StyledSkeletonTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  margin-bottom: ${tokens.spacing.xlarge};
`;

const StyledSkeletonCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(333px, 1fr));
  gap: ${tokens.spacing.medium};
`;

const StyledSkeletonCard = styled.div`
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
`;

const StyledSkeletonCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledSkeletonCardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
`;

const StyledSkeletonCardStats = styled.div`
  display: flex;
  gap: ${tokens.spacing.small};
`;
