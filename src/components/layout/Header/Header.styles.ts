import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { HEADER_HEIGHT } from './Header.constants';

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT};
  background-color: ${tokens.colors.white};
  box-sizing: border-box;
  width: 100%;
  padding: 24px 60px;
`;

export const BreadcrumbNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxlarge};
`;

export const BreadcrumbItem = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.neutral[700]};
  white-space: nowrap;
`;

export const BreadcrumbSeparator = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.neutral[400]};
  margin: 0 ${tokens.spacing.xxsmall};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxlarge};
`;

export const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 113px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: 20px;
  padding: 6px 8px 6px 18px;
  box-sizing: border-box;
`;

export const SearchInput = styled.input`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[800]};
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  white-space: nowrap;

  &::placeholder {
    color: ${tokens.colors.neutral[400]};
  }

  &:focus {
    outline: none;
  }
`;

export const SearchIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${tokens.colors.neutral[200]};
  border: none;
  border-radius: 14px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.neutral[300]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const SearchIcon = styled.span`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 20px;
  line-height: 1;
  color: ${tokens.colors.neutral[400]};
  font-variation-settings: 'FILL' ${tokens.icons.fill[0]}, 'GRAD' ${tokens.icons.grade[0]},
    'opsz' ${tokens.icons.opticalSize[24]};
`;

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: ${tokens.spacing.xxsmall};
  border-radius: 20px;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  background: linear-gradient(90deg, ${tokens.colors.neutral[400]} 0%, ${tokens.colors.neutral[400]} 100%),
    linear-gradient(90deg, ${tokens.colors.neutral[200]} 0%, ${tokens.colors.neutral[200]} 100%);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const ProfileIcon = styled.span`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 32px;
  line-height: 1;
  color: ${tokens.colors.neutral[200]};
  font-variation-settings: 'FILL' ${tokens.icons.fill[1]}, 'GRAD' ${tokens.icons.grade[0]},
    'opsz' ${tokens.icons.opticalSize[40]};
`;
