import { useState } from 'react';
import type { FilterType } from '../_types';

export const useFilter = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const changeFilter = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  return {
    activeFilter,
    setFilter: changeFilter,
  };
};
