'use client';

import { FilterTab, FilterTabButton, FilterTabsContainer } from './FilterTabs.styles';
import type { FilterTabsProps, FilterTab as TFilterTab } from './FilterTabs.types';

const TABS: TFilterTab[] = [
  {
    value: 'latest',
    label: '최신순',
  },
  {
    value: 'progress',
    label: '진행률',
  },
  {
    value: 'name',
    label: '이름순',
  },
];

const FilterTabs = ({ activeTab, onTabClick }: FilterTabsProps) => (
  <FilterTabsContainer>
    {TABS.map((tab) => (
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
