'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

export default function SignInLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[200]}
      highlightColor={tokens.colors.neutral[100]}
    >
      <StyledContainer>
        <StyledHeaderSection>
          <Text variant="H2" color={tokens.colors.primary[500]}>
            HORIZON
          </Text>
          <Skeleton height={20} width={200} />
        </StyledHeaderSection>

        <StyledFormSection>
          <StyledFieldContainer>
            <StyledLabelSkeleton>
              <Skeleton height={16} width={60} />
            </StyledLabelSkeleton>
            <Skeleton height={48} />
          </StyledFieldContainer>

          <StyledFieldContainer>
            <StyledLabelSkeleton>
              <Skeleton height={16} width={80} />
            </StyledLabelSkeleton>
            <Skeleton height={48} />
          </StyledFieldContainer>
        </StyledFormSection>

        <StyledActionSection>
          <Skeleton height={48} />

          <StyledDivider>
            <Skeleton height={1} />
          </StyledDivider>

          <Skeleton height={48} />

          <StyledLinkSkeleton>
            <Skeleton height={16} width={150} />
          </StyledLinkSkeleton>
        </StyledActionSection>
      </StyledContainer>
    </SkeletonTheme>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  width: 400px;
`;

const StyledHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const StyledFormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledFieldContainer = styled.div``;

const StyledLabelSkeleton = styled.div`
  margin-bottom: 8px;
`;

const StyledActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledDivider = styled.div`
  padding: 20px 0;
`;

const StyledLinkSkeleton = styled.div`
  text-align: center;
  margin-top: 20px;
`;
