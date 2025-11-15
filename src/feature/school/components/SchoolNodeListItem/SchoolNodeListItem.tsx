'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';
import type { SchoolNode } from '../../types';

interface SchoolNodeListItemProps {
  node: SchoolNode;
}

export const SchoolNodeListItem = ({ node }: SchoolNodeListItemProps) => {
  return (
    <StyledItem>
      <StyledInfo>
        <Text as="span" variant="B1" color={tokens.colors.neutral[800]}>
          {node.name}
        </Text>
        <Text as="span" variant="B2" color={tokens.colors.neutral[600]}>
          담당: {node.teacher}
        </Text>
      </StyledInfo>
      <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
        사용 횟수: {node.usageCount}
      </Text>
    </StyledItem>
  );
};

const StyledItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${tokens.spacing.medium};
  background: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.small};
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
`;
