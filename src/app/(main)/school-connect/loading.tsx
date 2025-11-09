'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export default function SchoolConnectLoading() {
  return (
    <StyledLoadingContainer>
      <StyledLoadingText>로딩 중...</StyledLoadingText>
    </StyledLoadingContainer>
  );
}

const StyledLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 84px);
  background-color: ${tokens.colors.white};
`;

const StyledLoadingText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[600]};
`;
