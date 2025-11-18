'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
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

  const selectedOption = options.find((option) => option.value === selectedValue);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionSelect = (value: string) => {
    onChange?.(value);
    setIsExpanded(false);
  };

  return (
    <StyledContainer>
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
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.extraSmall};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${tokens.colors.neutral[400]};
  }

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
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
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.extraSmall};
  overflow: hidden;
  margin-top: 4px;
`;

const StyledDropdownItem = styled.button<{ $isSelected: boolean }>`
  position: relative;
  width: 100%;
  height: 32px;
  padding: 5px 8px;
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
