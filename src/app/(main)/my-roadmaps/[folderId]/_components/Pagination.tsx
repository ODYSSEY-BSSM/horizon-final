'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <StyledContainer>
      <StyledNavButton onClick={handlePrevClick} disabled={currentPage === 1}>
        <Icon
          name="chevron_left"
          variant="SM"
          color={currentPage === 1 ? tokens.colors.neutral[300] : tokens.colors.neutral[800]}
          decorative
        />
      </StyledNavButton>
      <StyledPagesContainer>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <StyledPageItem
            key={page}
            $active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            <Text
              variant="B1"
              color={page === currentPage ? tokens.colors.neutral[800] : tokens.colors.neutral[600]}
            >
              {page}
            </Text>
          </StyledPageItem>
        ))}
      </StyledPagesContainer>
      <StyledNavButton onClick={handleNextClick} disabled={currentPage === totalPages}>
        <Icon
          name="chevron_right"
          variant="SM"
          color={
            currentPage === totalPages ? tokens.colors.neutral[300] : tokens.colors.neutral[800]
          }
          decorative
        />
      </StyledNavButton>
    </StyledContainer>
  );
};

export default Pagination;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const StyledNavButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${tokens.colors.white};
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0;

  &:hover:not(:disabled) {
    background-color: ${tokens.colors.neutral[100]};
    border-radius: ${tokens.radius.small};
  }
`;

const StyledPagesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const StyledPageItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${tokens.colors.white};
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    background-color: ${({ $active }) =>
      $active ? tokens.colors.primary[200] : tokens.colors.white};
    border-radius: ${tokens.radius.medium};
    z-index: 0;
  }

  span {
    position: relative;
    z-index: 1;
    font-weight: ${tokens.typos.fontWeight.semibold};
    font-size: ${tokens.typos.fontSize[14]};
    line-height: ${tokens.typos.lineHeight[20]};
  }
`;
