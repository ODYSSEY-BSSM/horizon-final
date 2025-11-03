'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import type { PaginationState } from '../_types';

interface PaginationProps {
  paginationState: PaginationState;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  className?: string;
}

const Pagination = ({
  paginationState,
  onPageChange,
  onNextPage,
  onPrevPage,
  className,
}: PaginationProps) => {
  const { currentPage, totalPages } = paginationState;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generate page numbers to display (show current page and maybe one more if there's space)
  const getPageNumbers = () => {
    const pages: number[] = [];

    // Simple implementation: show current page and next page if it exists
    pages.push(currentPage);
    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <StyledContainer className={className}>
      <StyledNavButton onClick={onPrevPage} disabled={!canGoPrev} type="button">
        <Icon
          icon="chevron_left"
          size={20}
          color={canGoPrev ? tokens.colors.neutral[900] : tokens.colors.neutral[400]}
        />
      </StyledNavButton>

      <StyledPageList>
        {pageNumbers.map((page) => {
          const isActive = page === currentPage;
          return (
            <StyledPageButton
              key={page}
              onClick={() => onPageChange(page)}
              $isActive={isActive}
              type="button"
            >
              <StyledPageNumber $isActive={isActive}>
                <Text
                  variant="B1"
                  color={isActive ? tokens.colors.neutral[900] : tokens.colors.neutral[700]}
                >
                  {page}
                </Text>
              </StyledPageNumber>
            </StyledPageButton>
          );
        })}
      </StyledPageList>

      <StyledNavButton onClick={onNextPage} disabled={!canGoNext} type="button">
        <Icon
          icon="chevron_right"
          size={20}
          color={canGoNext ? tokens.colors.neutral[900] : tokens.colors.neutral[400]}
        />
      </StyledNavButton>
    </StyledContainer>
  );
};

export default Pagination;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
`;

const StyledNavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${tokens.colors.white};
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:not(:disabled):hover {
    opacity: 0.7;
  }
`;

const StyledPageList = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const StyledPageButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const StyledPageNumber = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ $isActive }) =>
    $isActive ? tokens.colors.primary[100] : tokens.colors.white};
  transition: background-color 0.2s;

  ${StyledPageButton}:hover & {
    background-color: ${({ $isActive }) =>
      $isActive ? tokens.colors.primary[100] : tokens.colors.neutral[100]};
  }
`;
