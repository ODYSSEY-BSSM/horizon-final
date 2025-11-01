'use client';

import { FILTER_TABS } from '../_constants/FilterTabs.constants';
import { FilterTab, FilterTabButton, FilterTabsContainer } from './FilterTabs.styles';
import type { FilterTabsProps } from './FilterTabs.types';

const FilterTabs = ({ activeTab, onTabClick }: FilterTabsProps) => (
  <FilterTabsContainer>
    {FILTER_TABS.map((tab) => (
      <FilterTab key={tab.value} active={activeTab === tab.value}>
        <FilterTabButton
          variant="outlined"
          size="small"
          onClick={() => onTabClick(tab.value)}
          active={activeTab === tab.value}
        >
          {tab.label}
        </FilterTabButton>
      </FilterTab>
    ))}
  </FilterTabsContainer>
);

export default FilterTabs;
