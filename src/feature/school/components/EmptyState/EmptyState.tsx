'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Button, Text } from '@/shared/ui';

interface EmptyStateProps {
  onConnect: () => void;
}

export const EmptyState = ({ onConnect }: EmptyStateProps) => {
  return (
    <StyledContainer>
      <StyledContent>
        <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
          학교 연동
        </Text>
        <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
          학교 코드를 입력하여 학교와 연동하세요.
        </Text>
        <Button onClick={onConnect} variant="primary" size="medium">
          학교 연동하기
        </Button>
      </StyledContent>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.large};
  text-align: center;
`;
