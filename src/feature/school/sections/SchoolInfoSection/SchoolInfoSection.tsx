'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { SchoolCard } from '@/feature/school';
import type { SchoolInfo } from '@/feature/school';

interface SchoolInfoSectionProps {
  school: SchoolInfo;
  onDisconnect: () => void;
}

const SchoolInfoSection = ({ school, onDisconnect }: SchoolInfoSectionProps) => {
  return (
    <StyledSection>
      <SchoolCard school={school} onDisconnect={onDisconnect} />
    </StyledSection>
  );
};

export default SchoolInfoSection;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;
