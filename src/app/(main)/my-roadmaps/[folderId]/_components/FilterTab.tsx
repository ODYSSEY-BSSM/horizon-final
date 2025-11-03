'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { FILTER_OPTIONS } from '../_constants/filters.constants';
import type { FilterType } from '../_types';

interface FilterTabProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  className?: string;
}

const FilterTab = ({ activeFilter, onFilterChange, className }: FilterTabProps) => {
  return (
    <StyledContainer className={className}>
      <StyledTabList>
        {FILTER_OPTIONS.map((option) => {
          const isActive = option.id === activeFilter;
          return (
            <StyledTab
              key={option.id}
              onClick={() => onFilterChange(option.id)}
              $isActive={isActive}
              type="button"
            >
              <Text
                variant="B1"
                color={isActive ? tokens.colors.primary[500] : tokens.colors.neutral[600]}
              >
                {option.label}
              </Text>
            </StyledTab>
          );
        })}
      </StyledTabList>
    </StyledContainer>
  );
};

export default FilterTab;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${tokens.colors.white};
`;

const StyledTabList = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${tokens.spacing.large};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
  gap: ${tokens.spacing.small};
`;

const StyledTab = styled.button<{ $isActive: boolean }>`
  position: relative;
  padding: ${tokens.spacing.medium} 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $isActive }) =>
    $isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${tokens.colors.primary[500]};
    }
  `}
`;
