'use client';

import styled from '@emotion/styled';
import { SchoolNodeListItem } from '@/feature/school/components/SchoolNodeListItem';
import { tokens } from '@/shared/tokens';
import { Button, Text } from '@/shared/ui';
import type { SchoolNode } from '../../types';

interface SchoolNodeListSectionProps {
  nodes: SchoolNode[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const SchoolNodeListSection = ({
  nodes,
  currentPage,
  totalPages,
  onPageChange,
}: SchoolNodeListSectionProps) => {
  return (
    <StyledSection>
      <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
        교육 노드 목록
      </Text>
      <StyledList>
        {nodes.map((node) => (
          <SchoolNodeListItem key={node.id} node={node} />
        ))}
      </StyledList>
      {totalPages > 1 && (
        <StyledPagination>
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            size="small"
          >
            이전
          </Button>
          <Text as="span" variant="B1" color={tokens.colors.neutral[600]}>
            {currentPage} / {totalPages}
          </Text>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
            size="small"
          >
            다음
          </Button>
        </StyledPagination>
      )}
    </StyledSection>
  );
};

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
`;

const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${tokens.spacing.medium};
  margin-top: ${tokens.spacing.medium};
`;
