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
    <Container
      ref={dropdownRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <IconButton $state={state}>
        <Icon $state={state} className="material-symbols-rounded">
          {icon}
        </Icon>
      </IconButton>

      {hasDropdown && (
        <DropdownButtonWrapper>
          {isDropdownOpen && dropdownOptions.length > 0 && (
            <DropdownMenuWrapper>
              <ToolbarList options={dropdownOptions} onSelect={handleDropdownSelect} />
            </DropdownMenuWrapper>
          )}
          <DropdownButton $state={dropdownState} onClick={handleDropdownClick}>
            <DropdownIcon className="material-symbols-rounded">arrow_drop_down</DropdownIcon>
          </DropdownButton>
        </DropdownButtonWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const IconButton = styled.div<{ $state: ToolbarItemState }>`
  width: 36px;
  height: 36px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.radius.xs};
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

const Icon = styled.span<{ $state?: ToolbarItemState }>`
  font-family: 'Material Symbols Rounded', sans-serif;
  font-size: 20px;
  line-height: 1;
  color: ${(props) =>
    props.$state === 'selected' ? tokens.colors.white : tokens.colors.neutral[700]};
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
`;

const DropdownButtonWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  width: 12px;
  height: 36px;
  gap: 8px;
`;

const DropdownMenuWrapper = styled.div`
  position: absolute;
  bottom: 52px;
  left: 0;
  z-index: 1000;
`;

const DropdownButton = styled.div<{ $state: ToolbarItemState }>`
  width: 12px;
  height: 36px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.radius.xs};
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

const DropdownIcon = styled.span`
  font-family: 'Material Symbols Rounded', sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 1;
  color: ${tokens.colors.neutral[700]};
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0;
`;
