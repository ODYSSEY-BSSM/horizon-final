'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Button, Text } from '@/shared/ui';
import type { SchoolInfo } from '../../types';

interface SchoolInfoSectionProps {
  school: SchoolInfo;
  onDisconnect: () => void;
}

export const SchoolInfoSection = ({ school, onDisconnect }: SchoolInfoSectionProps) => {
  return (
    <StyledSection>
      <StyledCard>
        {school.logoUrl && <StyledLogo src={school.logoUrl} alt={school.name} />}
        <StyledInfo>
          <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
            {school.name}
          </Text>
          <Text as="p" variant="B2" color={tokens.colors.neutral[600]}>
            교육 노드: {school.nodeCount}개
          </Text>
        </StyledInfo>
        <Button onClick={onDisconnect} variant="secondary" size="small">
          연동 해제
        </Button>
      </StyledCard>
    </StyledSection>
  );
};

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
`;

const StyledCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
  padding: ${tokens.spacing.xlarge};
  background: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
`;

const StyledLogo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: ${tokens.radius.medium};
  object-fit: cover;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
  flex: 1;
`;
