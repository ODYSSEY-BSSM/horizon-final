import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import { tokens } from '@/shared/tokens';

export const FilterTabsContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.large};
  border-bottom: 2px solid ${tokens.colors.neutral[100]};
  background-color: ${tokens.colors.white};
  width: 100%;
  padding: 0 24px;
`;

export const FilterTab = styled.div<{ active?: boolean }>`
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

export const FilterTabButton = styled(Button)<{ active?: boolean }>`
  padding: 16px 4px !important;
  border-radius: 0;
  border: none;

  &:hover {
    background-color: transparent;
  }

  &:active {
    background-color: transparent;
  }

  &:focus {
    background-color: transparent;
  }

  span {
    color: ${({ active }) => (active ? tokens.colors.primary[500] : tokens.colors.neutral[500])};
  }
`;
