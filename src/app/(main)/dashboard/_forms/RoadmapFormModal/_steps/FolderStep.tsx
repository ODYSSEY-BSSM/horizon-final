'use client';

import styled from '@emotion/styled';
import { useId } from 'react';

import { useFolderStep } from '@/app/(main)/dashboard/_hooks/useFolderStep';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/shared/tokens';
import { FOLDER_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';
import { useDropdown } from '../../../_hooks/useDropdown';
import FormFooter from '../_components/FormFooter';
import { MODAL_SPACING } from '../_constants/spacing';

const FolderStep = () => {
  const labelId = useId();
  const dropdownButtonId = `${labelId}-button`;
  const newFolderInputId = `${labelId}-input`;
  const {
    isValid,
    onNext,
    newFolderMode,
    newFolderName,
    setNewFolderName,
    selectedFolder,
    hasSelection,
    handleFolderSelect,
    handleNewFolderClick,
    handleNewFolderSubmit,
    handleNewFolderBlur,
    getDisplayText,
  } = useFolderStep();
  const FOLDER_OPTIONS_WITH_NEW = [{ id: 'new', label: '새 폴더' }, ...FOLDER_OPTIONS];
  const { isOpen, setIsOpen, dropdownRef, highlightedIndex, handleKeyDown } = useDropdown({
    itemCount: FOLDER_OPTIONS_WITH_NEW.length,
    onSelect: (index) => {
      if (index === 0) {
        handleNewFolderClick();
      } else {
        handleFolderSelect(FOLDER_OPTIONS_WITH_NEW[index].id);
      }
    },
  });

  return (
    <StyledFormContainer>
      <StyledContent>
        <StyledDropdownContainer>
          <Text
            as="label"
            id={labelId}
            htmlFor={newFolderMode ? newFolderInputId : dropdownButtonId}
            variant="B1"
            color={tokens.colors.neutral[500]}
          >
            폴더
          </Text>

          {newFolderMode ? (
            <TextField
              id={newFolderInputId}
              aria-labelledby={labelId}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleNewFolderSubmit}
              onBlur={handleNewFolderBlur}
              placeholder="새 폴더 이름을 입력하세요"
              autoFocus
            />
          ) : (
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
                $isOpen={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="폴더 선택"
                aria-expanded={isOpen}
                aria-activedescendant={
                  isOpen && highlightedIndex !== -1
                    ? `folder-option-${FOLDER_OPTIONS_WITH_NEW[highlightedIndex].id}`
                    : undefined
                }
              >
                <Text
                  as="span"
                  variant="B1"
                  color={hasSelection ? tokens.colors.neutral[800] : tokens.colors.neutral[400]}
                >
                  {getDisplayText()}
                </Text>
                <Icon
                  name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                  variant="SM"
                  color={tokens.colors.neutral[400]}
                  decorative
                />
              </StyledDropdownHeader>

              <StyledDropdownList $isOpen={isOpen} role="listbox">
                {FOLDER_OPTIONS_WITH_NEW.map((option, index) => (
                  <StyledDropdownOption
                    type="button"
                    key={option.id}
                    id={`folder-option-${option.id}`}
                    onClick={() => {
                      if (option.id === 'new') {
                        handleNewFolderClick();
                      } else {
                        handleFolderSelect(option.id);
                      }
                      setIsOpen(false);
                    }}
                    $highlighted={highlightedIndex === index}
                    role="option"
                    aria-selected={selectedFolder?.id === option.id}
                  >
                    {option.id === 'new' && (
                      <StyledNewOptionIcon>
                        <Icon
                          name="add"
                          variant="SM"
                          color={tokens.colors.neutral[600]}
                          decorative
                        />
                      </StyledNewOptionIcon>
                    )}
                    <Text as="span" variant="B1" color={tokens.colors.neutral[600]}>
                      {option.label}
                    </Text>
                  </StyledDropdownOption>
                ))}
              </StyledDropdownList>
            </div>
          )}
        </StyledDropdownContainer>
      </StyledContent>

      <FormFooter onNext={onNext} isValid={isValid} showPrevious={false} isLastStep={false} />
    </StyledFormContainer>
  );
};

export default FolderStep;

const StyledDropdownContainer = styled.div`
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
  height: ${MODAL_SPACING.steps.dropdown.height};
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

const StyledDropdownList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  z-index: 1001;
  max-height: ${MODAL_SPACING.steps.dropdown.maxHeight};
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const StyledDropdownOption = styled.button<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  width: 100%;
  height: ${MODAL_SPACING.steps.dropdown.height};
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

const StyledNewOptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledContent = styled.div`
  padding: ${MODAL_SPACING.modal.padding};
  flex: 1;
`;
