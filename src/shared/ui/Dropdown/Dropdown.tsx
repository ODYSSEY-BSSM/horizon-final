'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideDropdown = dropdownRef.current?.contains(target);
      const isInsideMenu = menuRef.current?.contains(target);

      if (!isInsideDropdown && !isInsideMenu) {
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

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: align === 'left' ? rect.left : 0,
        right: align === 'right' ? window.innerWidth - rect.right : 0,
      });
    }
  }, [isOpen, align]);

  const handleItemClick = (item: DropdownMenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    item.onClick();
    setIsOpen(false);
  };

  return (
    <StyledDropdownContainer ref={dropdownRef} $isOpen={isOpen}>
      <StyledTrigger
        ref={triggerRef}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </StyledTrigger>
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <StyledMenu ref={menuRef} $align={align} $position={menuPosition}>
            {items.map((item, index) => (
              <StyledMenuItem
                key={index}
                onClick={(e) => handleItemClick(item, e)}
                $variant={item.variant || 'default'}
              >
                {item.icon && <StyledIcon>{item.icon}</StyledIcon>}
                {item.label}
              </StyledMenuItem>
            ))}
          </StyledMenu>,
          document.body,
        )}
    </StyledDropdownContainer>
  );
};

export default Dropdown;

const StyledDropdownContainer = styled.div<{ $isOpen?: boolean }>`
  position: relative;
  display: inline-block;
  z-index: ${({ $isOpen }) => ($isOpen ? 9999 : 1)};
`;

const StyledTrigger = styled.div`
  cursor: pointer;
`;

const StyledMenu = styled.div<{
  $align: 'left' | 'right';
  $position: { top: number; left: number; right: number };
}>`
  position: fixed;
  top: ${({ $position }) => $position.top}px;
  ${({ $align, $position }) =>
    $align === 'right' ? `right: ${$position.right}px;` : `left: ${$position.left}px;`}
  background: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  min-width: 120px;
  padding: ${tokens.spacing.xsmall};
  z-index: 10000;
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
