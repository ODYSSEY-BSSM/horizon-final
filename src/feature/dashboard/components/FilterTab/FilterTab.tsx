import styled from '@emotion/styled';
import { FILTER_OPTIONS } from '@/feature/dashboard/constants/FilterTab.constants';
import type { FilterType } from '@/feature/dashboard/types/dashboard';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';

interface FilterTabProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterTab = ({ currentFilter, onFilterChange }: FilterTabProps) => {
  const entries = Object.entries(FILTER_OPTIONS) as Array<[FilterType, string]>;

  return (
    <StyledFilterTab>
      {entries.map(([key, value]) => (
        <StyledTabItem
          key={key}
          $isSelected={currentFilter === key}
          onClick={() => onFilterChange(key)}
        >
          <Text variant="B2">{value}</Text>
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
