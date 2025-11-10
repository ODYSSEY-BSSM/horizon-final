'use client';

import styled from '@emotion/styled';
import { Pagination } from '@/feature/roadmap';
import type { SchoolNode } from '@/feature/school';
import { SchoolNodeListItem } from '@/feature/school';
import { tokens } from '@/shared/tokens';

interface SchoolNodeListSectionProps {
  nodes: SchoolNode[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SchoolNodeListSection = ({
  nodes,
  currentPage,
  totalPages,
  onPageChange,
}: SchoolNodeListSectionProps) => {
  return (
    <StyledSection>
      <StyledListContainer>
        <StyledList>
          {nodes.map((node) => (
            <SchoolNodeListItem key={node.id} node={node} />
          ))}
        </StyledList>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </StyledListContainer>
    </StyledSection>
  );
};

export default SchoolNodeListSection;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const StyledListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.xlarge};
  overflow: hidden;
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.xlarge};
`;
