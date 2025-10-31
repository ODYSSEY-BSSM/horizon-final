'use client';

import styled from '@emotion/styled';
import { Controller } from 'react-hook-form';
import { useTeamStep } from '@/app/(main)/dashboard/_hooks/useTeamStep';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { TEAM_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';

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
  max-height: 240px;
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const StyledDropdownOption = styled.button<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  width: 100%;
  height: 48px;
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${({ $highlighted }) =>
    $highlighted ? tokens.colors.neutral[100] : tokens.colors.white};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};

  &:last-child {
    border-bottom: none;
  }

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
  padding: ${tokens.spacing.large};
  flex: 1;
`;

const StyledFormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${tokens.spacing.large};
  border-top: 1px solid ${tokens.colors.neutral[200]};
  margin-top: auto;
`;

const TeamStep = () => {
  const {
    control,
    errors,
    isValid,
    onNext,
    onPrevious,
    isOpen,
    setIsOpen,
    teamId,
    hasSelection,
    getDisplayText,
  } = useTeamStep();

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
              <div style={{ position: 'relative' }}>
                <StyledDropdownHeader
                  $isOpen={isOpen}
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="팀 선택"
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
                  {TEAM_OPTIONS.map((option) => (
                    <StyledDropdownOption
                      key={option.id}
                      onClick={() => {
                        field.onChange(option.id);
                        setIsOpen(false);
                      }}
                      $highlighted={teamId === option.id}
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

      <StyledFormFooter>
        <Button size="medium" variant="outlined" onClick={onPrevious} aria-label="이전 단계">
          이전
        </Button>
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

export default TeamStep;
