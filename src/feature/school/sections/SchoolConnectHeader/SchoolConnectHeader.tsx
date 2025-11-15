'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';

export const SchoolConnectHeader = () => {
  return (
    <StyledHeader>
      <Text as="h1" variant="H1" color={tokens.colors.neutral[800]}>
        학교 연동
      </Text>
      <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
        학교와 연동하여 교육 노드를 사용할 수 있습니다.
      </Text>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
`;
