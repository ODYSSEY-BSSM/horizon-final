import styled from '@emotion/styled';
import Link from 'next/link';
import { tokens } from '@/shared/tokens';
import { SIDEBAR_WIDTH } from './Sidebar.constants';

export const SidebarContainer = styled.aside`
  width: ${SIDEBAR_WIDTH};
  height: var(--app-height);
  background-color: ${tokens.colors.white};
  border-right: 1px solid ${tokens.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xlarge};
  padding: ${tokens.spacing.xlarge} ${tokens.spacing.large};
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const LogoArea = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  padding: ${tokens.spacing.small} ${tokens.spacing.xsmall};
  height: 64px;
  box-sizing: border-box;
  text-decoration: none;
`;

export const LogoImage = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
`;

export const LogoText = styled.h1`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  letter-spacing: -0.36px;
  color: ${tokens.colors.black};
  white-space: nowrap;
  margin: 0;
`;

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  width: 100%;
`;

export const MenuItemButton = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${tokens.spacing.small};
  height: 44px;
  padding: ${tokens.spacing.xsmall} ${tokens.spacing.small};
  border-radius: ${tokens.radius.medium};
  background-color: ${({ $selected }) => ($selected ? tokens.colors.primary[100] : tokens.colors.white)};
  border: none;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $selected }) =>
      $selected ? tokens.colors.primary[100] : tokens.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const MenuItemContent = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  color: ${({ $selected }) => ($selected ? tokens.colors.primary[500] : tokens.colors.neutral[500])};
`;

export const MenuItemIcon = styled.span<{ $selected: boolean }>`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 20px;
  line-height: 1;
  font-variation-settings: 'FILL' ${({ $selected }) => ($selected ? tokens.icons.fill[1] : tokens.icons.fill[0])},
    'GRAD' ${tokens.icons.grade[0]}, 'opsz' ${tokens.icons.opticalSize[24]};
`;

export const MenuItemText = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  white-space: nowrap;
`;

export const CheckIcon = styled.span`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 20px;
  line-height: 1;
  color: ${tokens.colors.success[200]};
  font-variation-settings: 'FILL' ${tokens.icons.fill[0]}, 'GRAD' ${tokens.icons.grade[0]},
    'opsz' ${tokens.icons.opticalSize[24]};
`;
