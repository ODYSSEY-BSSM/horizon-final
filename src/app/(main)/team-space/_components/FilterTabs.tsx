'use client';

import styled from '@emotion/styled';
import type { FilterTab } from '@/lib/types/team';
import { tokens } from '@/shared/tokens';

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

export default function FilterTabs({ tabs, activeTab, onTabClick }: FilterTabsProps) {
  return (
    <StyledTabContainer>
      {tabs.map((tab) => (
        <StyledTab
          key={tab.value}
          $active={activeTab === tab.value}
          onClick={() => onTabClick(tab.value)}
        >
          {tab.label}
        </StyledTab>
      ))}
    </StyledTabContainer>
  );
}

const StyledTabContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  background-color: ${tokens.colors.white};
  border-bottom: 2px solid ${tokens.colors.neutral[100]};
  width: 100%;
`;

const StyledTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 4px;
  height: 52px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 2px solid ${(props) => (props.$active ? tokens.colors.primary[500] : 'transparent')};
  margin-bottom: -2px;

  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[20]};
  color: ${(props) => (props.$active ? tokens.colors.primary[500] : tokens.colors.neutral[500])};

  &:hover {
    color: ${tokens.colors.primary[500]};
  }
`;
