'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import type { FilterTab } from '@/lib/types/team';
import { tokens } from '@/shared/tokens';
import { FILTER_TABS } from '../_constants/FilterTabs.constants';

interface TeamFilterTabsProps {
  activeTab: FilterTab;
  onTabClick: (tab: FilterTab) => void;
}

const TeamFilterTabs = ({ activeTab, onTabClick }: TeamFilterTabsProps) => {
  return (
    <StyledTabsContainer>
      {FILTER_TABS.map((tab) => (
        <StyledTab
          key={tab.value}
          $isActive={activeTab === tab.value}
          onClick={() => onTabClick(tab.value)}
        >
          <Text
            as="span"
            variant="B2"
            color={
              activeTab === tab.value ? tokens.colors.primary[500] : tokens.colors.neutral[700]
            }
          >
            {tab.label}
          </Text>
        </StyledTab>
      ))}
    </StyledTabsContainer>
  );
};

export default TeamFilterTabs;

const StyledTabsContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.small} ${tokens.spacing.large};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
`;

const StyledTab = styled.button<{ $isActive: boolean }>`
  padding: ${tokens.spacing.small} 0;
  background: none;
  border: none;
  border-bottom: ${({ $isActive }) =>
    $isActive ? `2px solid ${tokens.colors.primary[500]}` : '2px solid transparent'};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-bottom-color: ${tokens.colors.primary[500]};
  }
`;
