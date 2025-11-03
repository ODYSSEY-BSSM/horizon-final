'use client';

import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import { tokens } from '@/shared/tokens';
import { FILTER_TABS } from '../_constants/FilterTabs.constants';

interface FilterTabsProps {
  activeTab: string;
  onTabClick: (value: string) => void;
}

const FilterTabs = ({ activeTab, onTabClick }: FilterTabsProps) => {
  return (
    <StyledFilterTabsContainer>
      {FILTER_TABS.map((tab) => (
        <StyledFilterTab key={tab.value} active={activeTab === tab.value}>
          <StyledUnderlinedButton
            variant="outlined"
            size="small"
            onClick={() => onTabClick(tab.value)}
            active={activeTab === tab.value}
          >
            {tab.label}
          </StyledUnderlinedButton>
        </StyledFilterTab>
      ))}
    </StyledFilterTabsContainer>
  );
};

export default FilterTabs;

const StyledFilterTabsContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.large};
  border-bottom: 2px solid ${tokens.colors.neutral[100]};
  background-color: ${tokens.colors.white};
  width: 100%;
  padding: 0 24px;
`;

const StyledFilterTab = styled.div<{ active?: boolean }>`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${tokens.colors.primary[500]};
    display: ${({ active }) => (active ? 'block' : 'none')};
  }
`;

const StyledUnderlinedButton = styled(Button)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  height: 52px;
  padding: 10px 4px;
  color: ${({ active }) => (active ? tokens.colors.primary[500] : tokens.colors.neutral[500])};

  &:hover {
    background-color: transparent;
    color: ${tokens.colors.primary[500]};
  }

  &:active {
    background-color: transparent;
    color: ${tokens.colors.primary[500]};
  }
`;
