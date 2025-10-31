'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { TEAM_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';
import { useTeamStepForm } from '../../_hooks/useRoadmapForm';
import {
  StyledDropdownContainer,
  StyledDropdownHeader,
  StyledDropdownList,
  StyledDropdownOption,
} from '../RoadmapFormModal.styles';

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
    onNext,
    onPrevious,
    formState: { errors, isValid },
    watch,
  } = useTeamStepForm();
  const [isOpen, setIsOpen] = useState(false);

  const teamId = watch('teamId');
  const selectedTeam = teamId ? TEAM_OPTIONS.find((option) => option.id === teamId) : null;

  const _handleTeamSelect = (_selectedTeamId: string) => {
    // This will be handled through RHF Controller
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedTeam) {
      return selectedTeam.label;
    }
    return '팀을 선택해주세요';
  };

  const hasSelection = !!teamId;

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
                  <Text variant="C1" color={tokens.colors.error[500]}>
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
