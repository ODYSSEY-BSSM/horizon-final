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
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastSelectedValue, setLastSelectedValue] = useState<string | null>(
    dropdownOptions.length > 0 ? dropdownOptions[0].value : null,
  );
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
    // 드롭다운이 있으면 최근 선택 항목 실행, 없으면 기본 액션
    if (hasDropdown && lastSelectedValue) {
      onDropdownSelect?.(lastSelectedValue);
    } else {
      onSelect?.();
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDropdownSelect = (value: string) => {
    setLastSelectedValue(value);
    onDropdownSelect?.(value);
    setIsDropdownOpen(false);
  };

  const iconState: ToolbarItemState = isSelected ? 'selected' : isIconHovered ? 'hover' : 'default';
  const dropdownState: ToolbarItemState = isDropdownOpen || isDropdownHovered ? 'hover' : 'default';
  const iconColor = isSelected ? tokens.colors.white : tokens.colors.neutral[700];

  return (
    <StyledContainer ref={dropdownRef}>
      <StyledIconButton
        $state={iconState}
        $hasDropdown={hasDropdown}
        onClick={handleIconClick}
        onMouseEnter={() => setIsIconHovered(true)}
        onMouseLeave={() => setIsIconHovered(false)}
      >
        <Icon name={icon} variant="SM" color={iconColor} />
      </StyledIconButton>

      {hasDropdown && (
        <StyledDropdownButtonWrapper>
          {isDropdownOpen && dropdownOptions.length > 0 && (
            <StyledDropdownMenuWrapper onClick={(e) => e.stopPropagation()}>
              <ToolbarList options={dropdownOptions} onSelect={handleDropdownSelect} />
            </StyledDropdownMenuWrapper>
          )}
          <StyledDropdownButton
            $state={dropdownState}
            onClick={handleDropdownClick}
            onMouseEnter={() => setIsDropdownHovered(true)}
            onMouseLeave={() => setIsDropdownHovered(false)}
          >
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
  gap: 0;
`;

const StyledIconButton = styled.button<{ $state: ToolbarItemState; $hasDropdown?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) =>
    props.$hasDropdown
      ? `${tokens.radius.extraSmall} 0 0 ${tokens.radius.extraSmall}`
      : tokens.radius.extraSmall};
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
  width: 20px;
  height: 36px;
  gap: 8px;
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
  width: 20px;
  height: 36px;
  padding: 8px 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 ${tokens.radius.extraSmall} ${tokens.radius.extraSmall} 0;
  border: none;
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
