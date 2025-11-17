'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { tokens } from '@/shared/tokens';

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
    <Container>
      <Label>{label}</Label>

      <DropdownButton onClick={handleToggle} $isExpanded={isExpanded}>
        <ButtonText>{selectedOption?.label || placeholder}</ButtonText>
        <ArrowIcon className="material-symbols-rounded">
          {isExpanded ? 'arrow_drop_up' : 'arrow_drop_down'}
        </ArrowIcon>
      </DropdownButton>

      {isExpanded && (
        <DropdownMenu>
          {options.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              $isSelected={option.value === selectedValue}
            >
              <ItemText>{option.label}</ItemText>
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 240px;
  position: relative;
`;

const Label = styled.p`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const DropdownButton = styled.button<{ $isExpanded: boolean }>`
  position: relative;
  width: 100%;
  height: 32px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.xs};
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

const ButtonText = styled.p`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArrowIcon = styled.span`
  font-size: 16px;
  color: ${tokens.colors.neutral[600]};
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  line-height: 1;
  flex-shrink: 0;
`;

const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.xs};
  overflow: hidden;
  margin-top: 4px;
`;

const DropdownItem = styled.button<{ $isSelected: boolean }>`
  position: relative;
  width: 100%;
  height: 32px;
  padding: 5px 8px;
  background-color: ${(props) =>
    props.$isSelected ? tokens.colors.neutral[50] : tokens.colors.white};
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

const ItemText = styled.p`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
