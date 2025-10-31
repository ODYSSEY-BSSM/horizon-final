'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import type { FilterType } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';
import { FILTERS } from '../_constants/RoadmapList.constants';

export interface FilterTabProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterTap = ({ currentFilter, onFilterChange }: FilterTabProps) => {
  return (
    <StyledFilterTapContainer>
      {FILTERS.map((filter) => (
        <StyledFilterButton
          key={filter.id}
          $active={currentFilter === filter.id}
          onClick={() => onFilterChange(filter.id)}
        >
          <Text>{filter.label}</Text>
        </StyledFilterButton>
      ))}
    </StyledFilterTapContainer>
  );
};

export default FilterTap;

const StyledFilterTapContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxlarge};
  padding: 0 ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
`;

const StyledFilterButton = styled.button<{ $active: boolean }>`
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
