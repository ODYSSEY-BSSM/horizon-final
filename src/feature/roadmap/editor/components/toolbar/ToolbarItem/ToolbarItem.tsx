'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { tokens } from '@/shared/tokens';
import { ToolbarList, type ToolbarListOption } from '../ToolbarList';

export type ToolType = 'selector' | 'node' | 'section' | 'text' | 'ai';
export type ToolbarItemState = 'default' | 'hover' | 'selected';

export interface ToolbarItemProps {
  type: ToolType;
  icon: string;
  hasDropdown?: boolean;
  dropdownOptions?: ToolbarListOption[];
  isSelected?: boolean;
  onSelect?: () => void;
  onDropdownSelect?: (value: string) => void;
}

export const ToolbarItem = ({
  type,
  icon,
  hasDropdown = false,
  dropdownOptions = [],
  isSelected = false,
  onSelect,
  onDropdownSelect,
}: ToolbarItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleClick = () => {
    if (!hasDropdown) {
      onSelect?.();
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownSelect = (value: string) => {
    onDropdownSelect?.(value);
    setIsDropdownOpen(false);
  };

  const state: ToolbarItemState = isSelected ? 'selected' : isHovered ? 'hover' : 'default';
  const dropdownState = isDropdownOpen ? 'hover' : state;

  return (
    <StyledContainer
      ref={dropdownRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <StyledIconButton $state={state}>
        <StyledIcon $state={state} className="material-symbols-rounded">
          {icon}
        </StyledIcon>
      </StyledIconButton>

      {hasDropdown && (
        <StyledDropdownButtonWrapper>
          {isDropdownOpen && dropdownOptions.length > 0 && (
            <StyledDropdownMenuWrapper>
              <ToolbarList options={dropdownOptions} onSelect={handleDropdownSelect} />
            </StyledDropdownMenuWrapper>
          )}
          <StyledDropdownButton $state={dropdownState} onClick={handleDropdownClick}>
            <StyledDropdownIcon className="material-symbols-rounded">
              arrow_drop_down
            </StyledDropdownIcon>
          </StyledDropdownButton>
        </StyledDropdownButtonWrapper>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const StyledIconButton = styled.div<{ $state: ToolbarItemState }>`
  width: 36px;
  height: 36px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.radius.extraSmall};
  background-color: ${(props) => {
    switch (props.$state) {
      case 'selected':
        return tokens.colors.primary;
      case 'hover':
        return tokens.colors.neutral[100];
      default:
        return tokens.colors.white;
    }
  }};
  transition: background-color 0.2s;
`;

const StyledIcon = styled.span<{ $state?: ToolbarItemState }>`
  font-family: ${tokens.typos.fontFamily.icon};
  font-size: 20px;
  line-height: 1;
  color: ${(props) =>
    props.$state === 'selected' ? tokens.colors.white : tokens.colors.neutral[700]};
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
`;

const StyledDropdownButtonWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  width: 12px;
  height: 36px;
  gap: 8px;
`;

const StyledDropdownMenuWrapper = styled.div`
  position: absolute;
  bottom: 52px;
  left: 0;
  z-index: 1000;
`;

const StyledDropdownButton = styled.div<{ $state: ToolbarItemState }>`
  width: 12px;
  height: 36px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.radius.extraSmall};
  background-color: ${(props) => {
    switch (props.$state) {
      case 'hover':
        return tokens.colors.neutral[100];
      default:
        return tokens.colors.white;
    }
  }};
  transition: background-color 0.2s;
`;

const StyledDropdownIcon = styled.span`
  font-family: ${tokens.typos.fontFamily.icon};
  font-size: 12px;
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: 1;
  color: ${tokens.colors.neutral[700]};
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0;
`;
