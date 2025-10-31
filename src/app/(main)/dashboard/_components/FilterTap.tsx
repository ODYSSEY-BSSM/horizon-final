'use client';

import styled from '@emotion/styled';
import type { FilterType } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';
import { FILTERS } from '../_constants/RoadmapList.constants';

export interface FilterTapProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

// Styled Components
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxlarge};
  padding: 0 ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: ${tokens.spacing.xsmall} ${tokens.spacing.xxsmall};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? tokens.colors.primary[500] : 'transparent')};
  cursor: pointer;
  color: ${({ $active }) => ($active ? tokens.colors.primary[500] : tokens.colors.neutral[500])};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ $active }) => ($active ? tokens.colors.primary[500] : tokens.colors.neutral[700])};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: -2px;
  }
`;

const FilterLabel = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[20]};
  text-align: center;
  white-space: nowrap;
`;

const FilterTap = ({ currentFilter, onFilterChange }: FilterTapProps) => {
  return (
    <FilterContainer data-node-id="4502:1436">
      {FILTERS.map((filter) => (
        <FilterButton
          key={filter.id}
          $active={currentFilter === filter.id}
          onClick={() => onFilterChange(filter.id)}
          data-node-id="4452:1171"
        >
          <FilterLabel>{filter.label}</FilterLabel>
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

export default FilterTap;
