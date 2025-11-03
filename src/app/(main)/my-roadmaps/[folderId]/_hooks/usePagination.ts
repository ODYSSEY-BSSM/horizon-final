import { useMemo, useState } from 'react';
import { DEFAULT_PAGE } from '../_constants/pagination.constants';
import type { PaginationState } from '../_types';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

export const usePagination = ({ totalItems, itemsPerPage }: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  const paginationState: PaginationState = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
      currentPage,
      totalPages,
      itemsPerPage,
      totalItems,
    };
  }, [currentPage, totalItems, itemsPerPage]);

  const goToPage = (page: number) => {
    const { totalPages } = paginationState;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    goToPage(currentPage - 1);
  };

  const resetPage = () => {
    setCurrentPage(DEFAULT_PAGE);
  };

  return {
    paginationState,
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetPage,
  };
};
