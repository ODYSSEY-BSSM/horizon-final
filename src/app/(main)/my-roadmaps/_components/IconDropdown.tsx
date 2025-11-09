'use client';

import styled from '@emotion/styled';
import { useId } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { useDropdown } from '../_hooks/useDropdown';

export type IconOption =
  | 'language'
  | 'code'
  | 'shield'
  | 'database'
  | 'terminal'
  | 'integration_instructions'
  | 'web';

interface IconDropdownProps {
  value: IconOption;
  onChange: (value: IconOption) => void;
  label?: string;
}

const ICON_OPTIONS: { value: IconOption; label: string }[] = [
  { value: 'language', label: 'Language' },
  { value: 'code', label: 'Code' },
  { value: 'shield', label: 'Shield' },
  { value: 'database', label: 'Database' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'integration_instructions', label: 'Integration' },
  { value: 'web', label: 'Web' },
];

const IconDropdown = ({ value, onChange, label = '아이콘' }: IconDropdownProps) => {
  const labelId = useId();
  const buttonId = `${labelId}-button`;

  const { isOpen, setIsOpen, dropdownRef, highlightedIndex, handleKeyDown } = useDropdown({
    itemCount: ICON_OPTIONS.length,
  });

  const selectedOption = ICON_OPTIONS.find((opt) => opt.value === value) || ICON_OPTIONS[0];

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
            onChange(ICON_OPTIONS[highlightedIndex].value);
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
          aria-label="아이콘 선택"
          aria-expanded={isOpen}
          aria-activedescendant={
            isOpen && highlightedIndex !== -1
              ? `icon-option-${ICON_OPTIONS[highlightedIndex].value}`
              : undefined
          }
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.medium,
            }}
          >
            <StyledIconContainer>
              <Icon
                name={selectedOption.value}
                variant="SM"
                color={tokens.colors.black}
                filled
                decorative
              />
            </StyledIconContainer>
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
          {ICON_OPTIONS.map((option, index) => (
            <StyledIconOption
              type="button"
              key={option.value}
              id={`icon-option-${option.value}`}
              $selected={value === option.value}
              $highlighted={highlightedIndex === index}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option.value}
            >
              <StyledIconContainer>
                <Icon
                  name={option.value}
                  variant="SM"
                  color={tokens.colors.black}
                  filled
                  decorative
                />
              </StyledIconContainer>
              <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                {option.label}
              </Text>
            </StyledIconOption>
          ))}
        </StyledDropdownList>
      </div>
    </StyledContainer>
  );
};

export default IconDropdown;

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

const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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

const StyledIconOption = styled.button<{
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
