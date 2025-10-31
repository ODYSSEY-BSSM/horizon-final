'use client';

import styled from '@emotion/styled';
import { Controller } from 'react-hook-form';
import { useTeamStep } from '@/app/(main)/dashboard/_hooks/useTeamStep';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { TEAM_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';
import { useDropdown } from '../../_hooks/useDropdown';
import FormFooter from '../_components/FormFooter';
import { MODAL_SPACING } from '../_constants/spacing';

const TeamStep = () => {
  const { control, errors, isValid, onNext, onPrevious, teamId, hasSelection, getDisplayText } =
    useTeamStep();
  const { isOpen, setIsOpen, dropdownRef, highlightedIndex, handleKeyDown } = useDropdown({
    itemCount: TEAM_OPTIONS.length,
    onSelect: (_index) => {
      // `control` is not directly accessible here, so we call field.onChange inside the render prop
    },
  });

  return (
    <StyledFormContainer>
      <StyledContent>
        <StyledDropdownContainer>
          <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
            팀
          </Text>

          <Controller
            name="teamId"
            control={control}
            render={({ field }) => (
              <div
                style={{ position: 'relative' }}
                ref={dropdownRef}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                  if (e.key === 'Enter' && highlightedIndex !== -1) {
                    field.onChange(TEAM_OPTIONS[highlightedIndex].id);
                    setIsOpen(false);
                  }
                }}
                role="group"
              >
                <StyledDropdownHeader
                  $isOpen={isOpen}
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="팀 선택"
                  aria-expanded={isOpen}
                  aria-activedescendant={
                    isOpen && highlightedIndex !== -1
                      ? `team-option-${TEAM_OPTIONS[highlightedIndex].id}`
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
                  {TEAM_OPTIONS.map((option, index) => (
                    <StyledDropdownOption
                      key={option.id}
                      id={`team-option-${option.id}`}
                      onClick={() => {
                        field.onChange(option.id);
                        setIsOpen(false);
                      }}
                      $highlighted={highlightedIndex === index}
                      role="option"
                      aria-selected={teamId === option.id}
                    >
                      <Text as="span" variant="B1" color={tokens.colors.neutral[600]}>
                        {option.label}
                      </Text>
                    </StyledDropdownOption>
                  ))}
                </StyledDropdownList>
                {errors.teamId && (
                  <Text variant="C" color={tokens.colors.error[200]}>
                    {errors.teamId.message}
                  </Text>
                )}
              </div>
            )}
          />
        </StyledDropdownContainer>
      </StyledContent>

      <FormFooter
        onPrevious={onPrevious}
        onNext={onNext}
        isValid={isValid}
        showPrevious={true}
        isLastStep={false}
      />
    </StyledFormContainer>
  );
};

export default TeamStep;

const StyledDropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 100%;
  position: relative;
  z-index: 1;
  flex: 1;
`;

const StyledDropdownHeader = styled.button.attrs({ type: 'button' })<{ $isOpen: boolean }>`
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

const StyledDropdownOption = styled.button.attrs({ type: 'button' })<{ $highlighted?: boolean }>`
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

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledContent = styled.div`
  padding: ${MODAL_SPACING.modal.padding};
  flex: 1;
`;
