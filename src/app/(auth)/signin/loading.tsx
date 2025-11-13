'use client';

import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { tokens } from '@/shared/tokens';

export default function SignInLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[100]}
      highlightColor={tokens.colors.neutral[200]}
    >
      <StyledPageWrapper>
        <StyledContentWrapper>
          <StyledHeaderWrapper>
            <Skeleton height={34} width={150} />
            <Skeleton height={20} width={250} />
          </StyledHeaderWrapper>

          <StyledFormWrapper>
            <StyledFieldContainer>
              <Skeleton height={20} width={60} style={{ marginBottom: '8px' }} />
              <Skeleton height={48} />
            </StyledFieldContainer>
            <StyledFieldContainer>
              <Skeleton height={20} width={80} style={{ marginBottom: '8px' }} />
              <Skeleton height={48} />
            </StyledFieldContainer>
          </StyledFormWrapper>

          <StyledActionsWrapper>
            <StyledButtonGroup>
              <Skeleton height={48} />
              <StyledDividerWrapper>
                <Skeleton height={1} />
              </StyledDividerWrapper>
              <Skeleton height={48} />
            </StyledButtonGroup>
            <div style={{ alignSelf: 'center' }}>
              <Skeleton height={16} width={200} />
            </div>
          </StyledActionsWrapper>
        </StyledContentWrapper>
      </StyledPageWrapper>
    </SkeletonTheme>
  );
}

const StyledPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;

const StyledContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  width: 400px;
`;

const StyledHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledDividerWrapper = styled.div`
  padding: 8px 0;
`;
