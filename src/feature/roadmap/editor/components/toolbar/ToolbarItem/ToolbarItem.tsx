'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';
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
    if (!isDropdownOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // 약간의 지연을 두어 즉시 닫히는 것을 방지
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleIconClick = () => {
    onSelect?.();
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDropdownOpen((prev) => {
      return !prev;
    });
  };

  const handleDropdownSelect = (value: string) => {
    onDropdownSelect?.(value);
    setIsDropdownOpen(false);
  };

  const state: ToolbarItemState = isSelected ? 'selected' : isHovered ? 'hover' : 'default';
  const dropdownState = isDropdownOpen ? 'hover' : state;
  const iconColor = isSelected ? tokens.colors.white : tokens.colors.neutral[700];

  return (
    <StyledContainer
      ref={dropdownRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledIconButton $state={state} onClick={handleIconClick}>
        <Icon name={icon} variant="SM" color={iconColor} />
      </StyledIconButton>

      {hasDropdown && (
        <StyledDropdownButtonWrapper>
          {isDropdownOpen && dropdownOptions.length > 0 && (
            <StyledDropdownMenuWrapper onClick={(e) => e.stopPropagation()}>
              <ToolbarList options={dropdownOptions} onSelect={handleDropdownSelect} />
            </StyledDropdownMenuWrapper>
          )}
          <StyledDropdownButton $state={dropdownState} onClick={handleDropdownClick}>
            <Icon name="arrow_drop_down" variant="XS" color={tokens.colors.neutral[700]} />
          </StyledDropdownButton>
        </StyledDropdownButtonWrapper>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledIconButton = styled.button<{ $state: ToolbarItemState }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.radius.extraSmall};
  border: none;
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
  cursor: pointer;
  padding: 0;
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
  margin-left: -4px;
`;

const StyledDropdownMenuWrapper = styled.div`
  position: absolute;
  bottom: 48px;
  left: -94px;
  z-index: 1000;
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.12));
  animation: slideUp 0.2s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledDropdownButton = styled.div<{ $state: ToolbarItemState }>`
  width: 12px;
  height: 36px;
  padding: 8px 0;
  box-sizing: border-box;
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
  color: ${tokens.colors.neutral[700]};
  cursor: pointer;
`;
