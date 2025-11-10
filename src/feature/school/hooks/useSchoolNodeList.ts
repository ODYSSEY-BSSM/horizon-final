import { useMemo, useState } from 'react';
import { ITEMS_PER_PAGE } from '../constants/schoolConnect.constants';
import type { SchoolNode } from '../types/schoolConnect.types';

export const useSchoolNodeList = (nodes: SchoolNode[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(nodes.length / ITEMS_PER_PAGE);

  const currentNodes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return nodes.slice(startIndex, endIndex);
  }, [nodes, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return {
    currentNodes,
    currentPage,
    totalPages,
    goToPage,
    goToPrevPage,
    goToNextPage,
  };
};
