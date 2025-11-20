'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface EditorDropdownProps {
  label?: string;
  options: DropdownOption[];
  selectedValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const EditorDropdown = ({
  label = 'Label',
  options,
  selectedValue,
  placeholder = 'example item',
  onChange,
}: EditorDropdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === selectedValue);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionSelect = (value: string) => {
    onChange?.(value);
    setIsExpanded(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
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
  }, [isExpanded]);

  return (
    <StyledContainer ref={containerRef}>
      <StyledLabel>{label}</StyledLabel>

      <StyledDropdownButton onClick={handleToggle} $isExpanded={isExpanded}>
        <StyledButtonText>{selectedOption?.label || placeholder}</StyledButtonText>
        <Icon
          name={isExpanded ? 'arrow_drop_up' : 'arrow_drop_down'}
          size={16}
          color={tokens.colors.neutral[600]}
        />
      </StyledDropdownButton>

      {isExpanded && (
        <StyledDropdownMenu>
          {options.map((option) => (
            <StyledDropdownItem
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              $isSelected={option.value === selectedValue}
            >
              <StyledItemText>{option.label}</StyledItemText>
            </StyledDropdownItem>
          ))}
        </StyledDropdownMenu>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 240px;
  position: relative;
`;

const StyledLabel = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.light};
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const StyledDropdownButton = styled.button<{ $isExpanded: boolean }>`
  position: relative;
  width: 100%;
  height: 32px;
  padding: 5px 8px;
  box-sizing: border-box;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.extraSmall};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${tokens.colors.neutral[400]};
  }

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary[500]};
  }
`;

const StyledButtonText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.light};
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.extraSmall};
  overflow: hidden;
  margin-top: 4px;
  background-color: ${tokens.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const StyledDropdownItem = styled.button<{ $isSelected: boolean }>`
  position: relative;
  width: 100%;
  height: 32px;
  padding: 5px 8px;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.$isSelected ? tokens.colors.neutral[100] : tokens.colors.white};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus {
    outline: none;
    background-color: ${tokens.colors.neutral[100]};
  }
`;

const StyledItemText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.light};
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
