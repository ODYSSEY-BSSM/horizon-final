'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { tokens } from '@/shared/tokens';
import type { NodeColor } from '../../types/node.types';

export interface ColorDropdownProps {
  selectedColor?: NodeColor;
  onColorChange?: (color: NodeColor) => void;
}

const COLOR_OPTIONS: Array<{ value: NodeColor; label: string; color: string }> = [
  { value: 'blue', label: 'Blue', color: '#2666dc' },
  { value: 'purple', label: 'Purple', color: '#a826dc' },
  { value: 'red', label: 'Red', color: '#dc2626' },
  { value: 'orange', label: 'Orange', color: '#ea580c' },
  { value: 'yellow', label: 'Yellow', color: '#e6c200' },
  { value: 'green', label: 'Green', color: '#16a34a' },
];

export const ColorDropdown = ({ selectedColor = 'blue', onColorChange }: ColorDropdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedOption = COLOR_OPTIONS.find((option) => option.value === selectedColor);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleColorSelect = (color: NodeColor) => {
    onColorChange?.(color);
    setIsExpanded(false);
  };

  return (
    <StyledContainer>
      <StyledLabel>색상</StyledLabel>

      <StyledDropdownButton onClick={handleToggle} $isExpanded={isExpanded}>
        <StyledButtonContent>
          <StyledColorSwatch $color={selectedOption?.color || '#2666dc'} />
          <StyledColorLabel>{selectedOption?.label || 'Blue'}</StyledColorLabel>
        </StyledButtonContent>
        <StyledArrowIcon className="material-symbols-rounded">
          {isExpanded ? 'arrow_drop_up' : 'arrow_drop_down'}
        </StyledArrowIcon>
      </StyledDropdownButton>

      {isExpanded && (
        <StyledDropdownMenu>
          {COLOR_OPTIONS.map((option) => (
            <StyledDropdownItem
              key={option.value}
              onClick={() => handleColorSelect(option.value)}
              $isSelected={option.value === selectedColor}
            >
              <StyledColorSwatch $color={option.color} />
              <StyledColorLabel>{option.label}</StyledColorLabel>
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

const StyledButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledColorSwatch = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.$color};
  border-radius: ${tokens.radius.extraSmall};
  flex-shrink: 0;
`;

const StyledColorLabel = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.light};
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[800]};
  margin: 0;
  white-space: nowrap;
`;

const StyledArrowIcon = styled.span`
  font-size: 16px;
  color: ${tokens.colors.neutral[600]};
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  line-height: 1;
`;

const StyledDropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.extraSmall};
  overflow: hidden;
`;

const StyledDropdownItem = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 5px 8px;
  background-color: ${(props) =>
    props.$isSelected ? tokens.colors.neutral[100] : tokens.colors.white};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus {
    outline: none;
    background-color: ${tokens.colors.neutral[100]};
  }
`;
