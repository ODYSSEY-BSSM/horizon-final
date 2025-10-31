import styled from '@emotion/styled';

import { Typography } from '@/components/common';
import { tokens } from '@/styles/tokens';

import type { FilterType } from '../../_types/filter.type';
import { FILTER_OPTIONS } from '../_constants/filter.constants';

interface FilterTabProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterTab = ({ currentFilter, onFilterChange }: FilterTabProps) => {
  return (
    <StyledFilterTab>
      {Object.entries(FILTER_OPTIONS).map(([key, value]) => (
        <StyledTabItem
          key={key}
          $isSelected={currentFilter === key}
          onClick={() => onFilterChange(key as FilterType)}
        >
          <Typography variant="B2_M">{value}</Typography>
        </StyledTabItem>
      ))}
    </StyledFilterTab>
  );
};

export default FilterTab;

const StyledFilterTab = styled.div`
  display: flex;
  gap: ${tokens.spacing.xxlarge};
  padding: 0 ${tokens.spacing.xxlarge};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
`;

const StyledTabItem = styled.div<{ $isSelected: boolean }>`
  cursor: pointer;
  padding: ${tokens.spacing.xsmall} ${tokens.spacing.xxsmall};
  border-bottom: 2px solid;
  border-color: ${({ $isSelected }) => ($isSelected ? tokens.colors.primary[500] : 'transparent')};
  color: ${({ $isSelected }) => ($isSelected ? tokens.colors.primary[500] : tokens.colors.neutral[500])};

  &:hover {
    color: ${tokens.colors.primary[500]};
  }
`;
