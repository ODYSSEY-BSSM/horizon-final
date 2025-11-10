'use client';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import type { SkeletonViewProps } from './SkeletonView.types';

/**
 * Unified SkeletonView component
 * Consolidates 2 duplicate implementations from my-roadmaps
 */
const SkeletonView = ({
  cardCount = 3,
  className,
  showContentBorder = true
}: SkeletonViewProps) => {
  return (
    <StyledContainer className={className}>
      <StyledHeader>
        <StyledSkeletonHeader />
        <StyledSkeletonButton />
      </StyledHeader>

      <StyledContent $showBorder={showContentBorder}>
        <StyledSkeletonTitleSection>
          <StyledSkeletonTitle />
          <StyledSkeletonSubtitle />
        </StyledSkeletonTitleSection>

        <StyledSkeletonCardsGrid>
          {Array.from({ length: cardCount }, (_, index) => ({ id: `skeleton-${index}` })).map((item) => (
            <StyledSkeletonCard key={item.id}>
              <StyledSkeletonCardIcon />
              <StyledSkeletonCardContent>
                <StyledSkeletonCardTitle />
                <StyledSkeletonCardDescription />
              </StyledSkeletonCardContent>
              <StyledSkeletonCardFooter>
                <StyledSkeletonCardStats>
                  <StyledSkeletonStat />
                  <StyledSkeletonStat />
                </StyledSkeletonCardStats>
                <StyledSkeletonCardAction />
              </StyledSkeletonCardFooter>
            </StyledSkeletonCard>
          ))}
        </StyledSkeletonCardsGrid>
      </StyledContent>
    </StyledContainer>
  );
};

export default SkeletonView;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

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

const StyledSkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${tokens.colors.neutral[100]} 25%,
    ${tokens.colors.neutral[200]} 50%,
    ${tokens.colors.neutral[100]} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${tokens.radius.small};
`;

const StyledSkeletonHeader = styled(StyledSkeletonBase)`
  width: 240px;
  height: 34px;
`;

const StyledSkeletonButton = styled(StyledSkeletonBase)`
  width: 120px;
  height: 48px;
  border-radius: ${tokens.radius.medium};
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

const StyledSkeletonTitle = styled(StyledSkeletonBase)`
  width: 160px;
  height: 20px;
`;

const StyledSkeletonSubtitle = styled(StyledSkeletonBase)`
  width: 280px;
  height: 20px;
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

const StyledSkeletonCardIcon = styled(StyledSkeletonBase)`
  width: 40px;
  height: 40px;
  border-radius: ${tokens.radius.medium};
`;

const StyledSkeletonCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledSkeletonCardTitle = styled(StyledSkeletonBase)`
  width: 100px;
  height: 20px;
`;

const StyledSkeletonCardDescription = styled(StyledSkeletonBase)`
  width: 148px;
  height: 12px;
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

const StyledSkeletonStat = styled(StyledSkeletonBase)`
  width: 64px;
  height: 16px;
`;

const StyledSkeletonCardAction = styled(StyledSkeletonBase)`
  width: 168px;
  height: 16px;
  align-self: flex-end;
`;
