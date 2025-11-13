'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function SignUpLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[100]}
      highlightColor={tokens.colors.neutral[200]}
    >
      <StyledContainer>
        <StyledCard>
          <StyledFormWrapper>
            <StyledContentWrapper>
              <StyledHeaderWrapper>
                <Skeleton height={34} width={150} />
                <Skeleton height={20} width={280} />
              </StyledHeaderWrapper>
              <StyledFieldAndButtonWrapper>
                <StyledFieldContainer>
                  <Skeleton height={20} width={60} style={{ marginBottom: '8px' }} />
                  <Skeleton height={48} />
                </StyledFieldContainer>
                <Skeleton height={48} />
              </StyledFieldAndButtonWrapper>

              <StyledDividerWrapper>
                <Skeleton height={1} />
              </StyledDividerWrapper>

              <StyledActionsWrapper>
                <Skeleton height={48} />
                <div style={{ alignSelf: 'center' }}>
                  <Skeleton height={16} width={200} />
                </div>
              </StyledActionsWrapper>
            </StyledContentWrapper>
          </StyledFormWrapper>
        </StyledCard>
      </StyledContainer>
    </SkeletonTheme>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${tokens.colors.background};
`;

const StyledCard = styled.div`
  width: 720px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  align-items: center;
  box-shadow: ${tokens.shadow[0]};
`;

const StyledFormWrapper = styled.div`
  margin-top: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 400px;
`;

const StyledHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const StyledFieldAndButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledDividerWrapper = styled.div`
  padding: 8px 0;
`;
