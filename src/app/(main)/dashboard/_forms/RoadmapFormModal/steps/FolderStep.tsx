'use client';

import styled from '@emotion/styled';

import { useFolderStep } from '@/app/(main)/dashboard/_hooks/useFolderStep';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/shared/tokens';
import { FOLDER_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';
import { MODAL_SPACING } from '../_constants/spacing';

const FolderStep = () => {
  const {
    isValid,
    onNext,
    isOpen,
    setIsOpen,
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

  return (
    <StyledFormContainer>
      <StyledContent>
        <StyledDropdownContainer>
          <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
            폴더
          </Text>

          {newFolderMode ? (
            <TextField
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleNewFolderSubmit}
              onBlur={handleNewFolderBlur}
              placeholder="새 폴더 이름을 입력하세요"
              autoFocus
            />
          ) : (
            <div style={{ position: 'relative' }}>
              <StyledDropdownHeader
                $isOpen={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="폴더 선택"
                aria-expanded={isOpen}
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

              <StyledDropdownList $isOpen={isOpen}>
                <StyledDropdownOption onClick={handleNewFolderClick}>
                  <StyledNewOptionIcon>
                    <Icon name="add" variant="SM" color={tokens.colors.neutral[600]} decorative />
                  </StyledNewOptionIcon>
                  <Text as="span" variant="B1" color={tokens.colors.neutral[600]}>
                    새 폴더
                  </Text>
                </StyledDropdownOption>

                {FOLDER_OPTIONS.map((option) => (
                  <StyledDropdownOption
                    key={option.id}
                    onClick={() => handleFolderSelect(option.id)}
                    $highlighted={selectedFolder?.id === option.id}
                  >
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

      <StyledFormFooter>
        <Button
          size="medium"
          variant="contained"
          onClick={onNext}
          disabled={!isValid}
          aria-label="다음 단계"
        >
          다음
        </Button>
      </StyledFormFooter>
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

const StyledFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 ${MODAL_SPACING.modal.padding} ${MODAL_SPACING.modal.padding};
  margin-top: auto;
`;
