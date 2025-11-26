'use client';

import { useMemo, useState } from 'react';
import type { EducationResponse } from '../types/schoolApi';

const ITEMS_PER_PAGE = 10;

export const useEducationPagination = (educations: EducationResponse[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(educations.length / ITEMS_PER_PAGE);

  const currentEducations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return educations.slice(startIndex, endIndex);
  }, [educations, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentEducations,
    currentPage,
    totalPages,
    goToPage,
  };
};
