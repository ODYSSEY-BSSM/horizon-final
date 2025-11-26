'use client';

import styled from '@emotion/styled';
import { Pagination } from '@/feature/roadmap/components/Pagination';
import { tokens } from '@/shared/tokens';
import { EducationNodeCard } from '../../components/EducationNodeCard';
import type { EducationResponse } from '../../types/schoolApi';

export interface EducationListSectionProps {
  educations: EducationResponse[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewClick?: (educationId: number) => void;
}

export const EducationListSection = ({
  educations,
  currentPage,
  totalPages,
  onPageChange,
  onViewClick,
}: EducationListSectionProps) => {
  return (
    <StyledContainer>
      <StyledListWrapper>
        <StyledList>
          {educations.map((education) => (
            <EducationNodeCard
              key={education.id}
              title={education.title}
              description={education.description || '설명 없음'}
              usageCount={education.usageCount || 0}
              onViewClick={() => onViewClick?.(education.id)}
            />
          ))}
        </StyledList>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </StyledListWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
`;

const StyledListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${tokens.colors.white};
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
`;
