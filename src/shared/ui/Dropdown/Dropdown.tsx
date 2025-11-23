'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { tokens } from '@/shared/tokens';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  icon?: React.ReactNode;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
}

const Dropdown = ({ trigger, items, align = 'right' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownMenuItem) => {
    item.onClick();
    setIsOpen(false);
  };

  return (
    <StyledDropdownContainer ref={dropdownRef}>
      <StyledTrigger onClick={() => setIsOpen(!isOpen)}>{trigger}</StyledTrigger>
      {isOpen && (
        <StyledMenu $align={align}>
          {items.map((item, index) => (
            <StyledMenuItem
              key={index}
              onClick={() => handleItemClick(item)}
              $variant={item.variant || 'default'}
            >
              {item.icon && <StyledIcon>{item.icon}</StyledIcon>}
              {item.label}
            </StyledMenuItem>
          ))}
        </StyledMenu>
      )}
    </StyledDropdownContainer>
  );
};

export default Dropdown;

const StyledDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledTrigger = styled.div`
  cursor: pointer;
`;

const StyledMenu = styled.div<{ $align: 'left' | 'right' }>`
  position: absolute;
  top: calc(100% + 4px);
  ${({ $align }) => ($align === 'right' ? 'right: 0;' : 'left: 0;')}
  background: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  min-width: 120px;
  padding: ${tokens.spacing.xsmall};
  z-index: 1000;
`;

const StyledMenuItem = styled.button<{ $variant: 'default' | 'danger' }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: ${tokens.radius.small};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.regular};
  color: ${({ $variant }) =>
    $variant === 'danger' ? tokens.colors.error[200] : tokens.colors.neutral[800]};
  text-align: left;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === 'danger' ? tokens.colors.error[100] : tokens.colors.neutral[100]};
  }
`;

const StyledIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
