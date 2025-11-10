'use client';

import styled from '@emotion/styled';
import { useId } from 'react';
import { useDropdown } from '@/feature/roadmap';
import { tokens } from '@/shared/tokens';
import { Icon, Text } from '@/shared/ui';

export type ColorOption = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

interface ColorDropdownProps {
  value: ColorOption;
  onChange: (value: ColorOption) => void;
  label?: string;
}

const COLOR_OPTIONS: { value: ColorOption; label: string; color: string }[] = [
  { value: 'red', label: 'Red', color: '#DC2626' },
  { value: 'orange', label: 'Orange', color: '#EA580C' },
  { value: 'yellow', label: 'Yellow', color: '#E6C200' },
  { value: 'green', label: 'Green', color: '#16A34A' },
  { value: 'blue', label: 'Blue', color: '#2666DC' },
  { value: 'purple', label: 'Purple', color: '#A826DC' },
];

const ColorDropdown = ({ value, onChange, label = '컬러' }: ColorDropdownProps) => {
  const labelId = useId();
  const buttonId = `${labelId}-button`;

  const { isOpen, setIsOpen, dropdownRef, highlightedIndex, handleKeyDown } = useDropdown({
    itemCount: COLOR_OPTIONS.length,
  });

  const selectedOption = COLOR_OPTIONS.find((opt) => opt.value === value) || COLOR_OPTIONS[0];

  return (
    <StyledContainer>
      <Text
        as="label"
        id={labelId}
        htmlFor={buttonId}
        variant="B1"
        color={tokens.colors.neutral[500]}
      >
        {label}
      </Text>
      <div
        style={{ position: 'relative' }}
        ref={dropdownRef}
        onKeyDown={(e) => {
          handleKeyDown(e);
          if (e.key === 'Enter' && highlightedIndex !== -1) {
            onChange(COLOR_OPTIONS[highlightedIndex].value);
            setIsOpen(false);
          }
        }}
        role="group"
      >
        <StyledDropdownHeader
          type="button"
          id={buttonId}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          $isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="색상 선택"
          aria-expanded={isOpen}
          aria-activedescendant={
            isOpen && highlightedIndex !== -1
              ? `color-option-${COLOR_OPTIONS[highlightedIndex].value}`
              : undefined
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.small }}>
            <StyledColorSwatch $color={selectedOption.color} />
            <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
              {selectedOption.label}
            </Text>
          </div>
          <Icon
            name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            variant="SM"
            color={tokens.colors.neutral[600]}
            decorative
          />
        </StyledDropdownHeader>

        <StyledDropdownList $isOpen={isOpen} role="listbox">
          {COLOR_OPTIONS.map((option, index) => (
            <StyledColorOption
              type="button"
              key={option.value}
              id={`color-option-${option.value}`}
              $selected={value === option.value}
              $highlighted={highlightedIndex === index}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option.value}
            >
              <StyledColorSwatch $color={option.color} />
              <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                {option.label}
              </Text>
            </StyledColorOption>
          ))}
        </StyledDropdownList>
      </div>
    </StyledContainer>
  );
};

export default ColorDropdown;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 100%;
  position: relative;
  z-index: 1;
  flex: 1;
`;

const StyledDropdownHeader = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${tokens.colors.white};
  border: ${({ $isOpen }) =>
    $isOpen
      ? `2px solid ${tokens.colors.primary[500]}`
      : `1px solid ${tokens.colors.neutral[300]}`};
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
  }

  &:focus-visible {
    outline: none;
    border-color: ${tokens.colors.primary[500]};
  }
`;

const StyledColorSwatch = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const StyledDropdownList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  z-index: 10000;
  max-height: 240px;
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
`;

const StyledColorOption = styled.button<{
  $selected: boolean;
  $highlighted: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  height: 48px;
  padding: ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
  border: none;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  ${({ $selected }) =>
    $selected &&
    `
    background-color: ${tokens.colors.primary[100]};
  `}

  ${({ $highlighted }) =>
    $highlighted &&
    `
    background-color: ${tokens.colors.primary[100]};
  `}
`;
