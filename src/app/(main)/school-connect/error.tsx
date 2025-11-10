'use client';

import styled from '@emotion/styled';
import { useEffect } from 'react';
import { tokens } from '@/shared/tokens';
import { Button, Text } from '@/shared/ui';

export default function SchoolConnectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: Error logging is intentional in error boundary
    console.error(error);
  }, [error]);

  return (
    <StyledErrorContainer>
      <StyledErrorContent>
        <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
          문제가 발생했습니다
        </Text>
        <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
          페이지를 불러오는 중 오류가 발생했습니다.
        </Text>
        <Button variant="contained" size="medium" onClick={reset}>
          다시 시도
        </Button>
      </StyledErrorContent>
    </StyledErrorContainer>
  );
}

const StyledErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 84px);
  background-color: ${tokens.colors.white};
  padding: ${tokens.spacing.xxlarge};
`;

const StyledErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.large};
  max-width: 400px;
  text-align: center;
`;
