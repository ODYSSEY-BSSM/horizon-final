'use client';

import styled from '@emotion/styled';
import { useId, useState } from 'react';
import { useDropdown } from '@/shared/hooks/useDropdown';
import { tokens } from '@/shared/tokens';
import { Button, Icon, Text } from '@/shared/ui';
import type {
  CurriculumOption,
  SchoolNodeConversionModalProps,
} from './SchoolNodeConversionModal.types';

// Mock curriculum options - replace with actual API data
const CURRICULUM_OPTIONS: CurriculumOption[] = [
  { id: '1', name: '2015 개정 교육과정' },
  { id: '2', name: '2022 개정 교육과정' },
  { id: '3', name: 'IB 교육과정' },
];

export const SchoolNodeConversionModal = ({
  isOpen,
  onClose,
  onConfirm,
  isConverting,
}: SchoolNodeConversionModalProps) => {
  const labelId = useId();
  const dropdownButtonId = `${labelId}-button`;
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>('');

  const {
    isOpen: isDropdownOpen,
    setIsOpen,
    dropdownRef,
    highlightedIndex,
    handleKeyDown,
  } = useDropdown({
    itemCount: CURRICULUM_OPTIONS.length,
    onSelect: (index: number) => {
      setSelectedCurriculumId(CURRICULUM_OPTIONS[index].id);
    },
  });

  const selectedOption = CURRICULUM_OPTIONS.find((opt) => opt.id === selectedCurriculumId);
  const hasSelection = !!selectedOption;

  const handleConfirm = () => {
    if (selectedCurriculumId) {
      onConfirm(selectedCurriculumId);
    }
  };

  const handleClose = () => {
    if (!isConverting) {
      onClose();
      setSelectedCurriculumId('');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <StyledOverlay onClick={handleClose}>
      <StyledFixedModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              학교 노드로 전환
            </Text>
            <StyledCloseButton onClick={handleClose} type="button" aria-label="닫기">
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
            적용할 교육과정을 선택해주세요.
          </Text>
        </StyledHeader>

        <StyledContent>
          <StyledDropdownSection>
            <Text
              as="label"
              id={labelId}
              htmlFor={dropdownButtonId}
              variant="B1"
              color={tokens.colors.neutral[500]}
            >
              교육과정
            </Text>

            <div
              style={{ position: 'relative' }}
              ref={dropdownRef}
              onKeyDown={handleKeyDown}
              role="group"
            >
              <StyledDropdownHeader
                type="button"
                id={dropdownButtonId}
                aria-labelledby={labelId}
                aria-haspopup="listbox"
                $isOpen={isDropdownOpen}
                onClick={() => setIsOpen(!isDropdownOpen)}
                disabled={isConverting}
                aria-label="교육과정 선택"
                aria-expanded={isDropdownOpen}
                aria-activedescendant={
                  isDropdownOpen && highlightedIndex !== -1
                    ? `curriculum-option-${CURRICULUM_OPTIONS[highlightedIndex].id}`
                    : undefined
                }
              >
                <Text
                  as="span"
                  variant="B1"
                  color={hasSelection ? tokens.colors.neutral[800] : tokens.colors.neutral[400]}
                >
                  {selectedOption?.name || '교육과정을 선택해주세요.'}
                </Text>
                <Icon
                  name={isDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                  variant="SM"
                  color={tokens.colors.neutral[400]}
                  decorative
                />
              </StyledDropdownHeader>

              <StyledDropdownList $isOpen={isDropdownOpen} role="listbox">
                {CURRICULUM_OPTIONS.map((option, index) => (
                  <StyledDropdownOption
                    type="button"
                    key={option.id}
                    id={`curriculum-option-${option.id}`}
                    onClick={() => {
                      setSelectedCurriculumId(option.id);
                      setIsOpen(false);
                    }}
                    $highlighted={highlightedIndex === index}
                    role="option"
                    aria-selected={selectedCurriculumId === option.id}
                  >
                    <Text as="span" variant="B1" color={tokens.colors.neutral[600]}>
                      {option.name}
                    </Text>
                  </StyledDropdownOption>
                ))}
              </StyledDropdownList>
            </div>
          </StyledDropdownSection>

          <StyledActions>
            <Button
              variant="contained"
              size="medium"
              onClick={handleConfirm}
              disabled={!selectedCurriculumId || isConverting}
            >
              {isConverting ? '확인 중...' : '확인'}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledFixedModal>
    </StyledOverlay>
  );
};

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledFixedModal = styled.div`
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.radius.large};
  width: 560px;
  height: 366px;
  max-width: 90vw;
  overflow: visible;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledHeader = styled.div`
  padding: 40px 40px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const StyledContent = styled.div`
  padding: 20px 40px 40px 40px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  flex: 1;
`;

const StyledDropdownSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  position: relative;
  z-index: 1;
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

  &:hover:not(:disabled) {
    border-color: ${tokens.colors.primary[500]};
  }

  &:focus-visible {
    outline: none;
    border-color: ${tokens.colors.primary[500]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledDropdownList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: ${tokens.spacing.xsmall};
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  z-index: 1001;
  max-height: 200px;
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const StyledDropdownOption = styled.button<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${({ $highlighted }) =>
    $highlighted ? tokens.colors.neutral[100] : tokens.colors.white};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: -2px;
  }
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;
