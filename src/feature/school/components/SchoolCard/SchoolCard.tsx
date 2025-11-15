'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';
import type { SchoolInfo } from '../../types';

interface SchoolCardProps {
  school: SchoolInfo;
}

export const SchoolCard = ({ school }: SchoolCardProps) => {
  return (
    <StyledCard>
      {school.logoUrl && <StyledLogo src={school.logoUrl} alt={school.name} />}
      <StyledInfo>
        <Text as="h3" variant="H3" color={tokens.colors.neutral[800]}>
          {school.name}
        </Text>
        <Text as="p" variant="B2" color={tokens.colors.neutral[600]}>
          교육 노드: {school.nodeCount}개
        </Text>
      </StyledInfo>
    </StyledCard>
  );
};

const StyledCard = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.large};
  background: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
`;

const StyledLogo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: ${tokens.radius.small};
  object-fit: cover;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;
