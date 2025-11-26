'use client';

import styled from '@emotion/styled';
import type { SchoolInfo } from '@/feature/school';
import { SchoolCard } from '@/feature/school';
import { tokens } from '@/shared/tokens';

interface SchoolInfoSectionProps {
  school: SchoolInfo;
  educationCount?: number;
  onDisconnect: () => void;
}

const SchoolInfoSection = ({ school, educationCount, onDisconnect }: SchoolInfoSectionProps) => {
  return (
    <StyledSection>
      <SchoolCard school={school} educationCount={educationCount} onDisconnect={onDisconnect} />
    </StyledSection>
  );
};

export default SchoolInfoSection;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;
