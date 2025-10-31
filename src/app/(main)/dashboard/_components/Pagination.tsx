'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import { tokens } from '@/shared/tokens';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Styled Components
const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
`;

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  position: relative;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const PageNumberButton = styled(PageButton)`
  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 4px;
    width: 24px;
    height: 24px;
    background-color: ${({ $active }) => ($active ? tokens.colors.primary[200] : 'transparent')};
    border-radius: ${tokens.radius.large};
    z-index: 0;
  }
`;

const PageNumber = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[20]};
  color: ${tokens.colors.neutral[800]};
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <PaginationContainer data-node-id="4502:1523">
      <PageButton
        $disabled={!canGoPrev}
        onClick={() => canGoPrev && onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
        disabled={!canGoPrev}
        data-node-id="4502:1486"
      >
        <Icon
          name="chevron_left"
          variant="SM"
          color={canGoPrev ? tokens.colors.neutral[700] : tokens.colors.neutral[300]}
          decorative
        />
      </PageButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PageNumberButton
          key={page}
          $active={currentPage === page}
          onClick={() => onPageChange(page)}
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? 'page' : undefined}
          data-node-id="4502:1478"
        >
          <PageNumber>{page}</PageNumber>
        </PageNumberButton>
      ))}

      <PageButton
        $disabled={!canGoNext}
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
        disabled={!canGoNext}
        data-node-id="4502:1490"
      >
        <Icon
          name="chevron_right"
          variant="SM"
          color={canGoNext ? tokens.colors.neutral[700] : tokens.colors.neutral[300]}
          decorative
        />
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
