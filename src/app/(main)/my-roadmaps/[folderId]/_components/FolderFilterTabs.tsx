'use client';

import styled from '@emotion/styled';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import { FOLDER_FILTER_TABS } from '../_constants/FilterTabs.constants';

interface FolderFilterTabsProps {
  activeTab: string;
  onTabClick: (value: string) => void;
}

const FolderFilterTabs = ({ activeTab, onTabClick }: FolderFilterTabsProps) => {
  return (
    <StyledFilterTabsContainer>
      {FOLDER_FILTER_TABS.map((tab) => (
        <StyledFilterTab key={tab.value} $active={activeTab === tab.value}>
          <StyledTabButton
            type="button"
            onClick={() => onTabClick(tab.value)}
            $active={activeTab === tab.value}
          >
            <Text
              variant="B1"
              color={
                activeTab === tab.value ? tokens.colors.primary[500] : tokens.colors.neutral[500]
              }
            >
              {tab.label}
            </Text>
          </StyledTabButton>
        </StyledFilterTab>
      ))}
    </StyledFilterTabsContainer>
  );
};

export default FolderFilterTabs;

const StyledFilterTabsContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.xlarge};
  border-bottom: 2px solid ${tokens.colors.neutral[100]};
  background-color: ${tokens.colors.white};
  width: 100%;
  padding: 0 ${tokens.spacing.xlarge};
`;

const StyledFilterTab = styled.div<{ $active?: boolean }>`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${tokens.colors.primary[500]};
    display: ${({ $active }) => ($active ? 'block' : 'none')};
  }
`;

const StyledTabButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  height: 52px;
  padding: 10px 4px;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? tokens.typos.fontWeight.semibold : tokens.typos.fontWeight.semibold)};
  transition: none;

  &:hover {
    background: none;
  }

  &:active {
    background: none;
  }
`;
