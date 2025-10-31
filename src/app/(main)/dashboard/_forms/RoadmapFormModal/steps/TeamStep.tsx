'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import type { FormStepProps } from '@/lib/types/modal';
import { tokens } from '@/shared/tokens';
import { TEAM_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';
import {
  DropdownContainer,
  DropdownHeader,
  DropdownList,
  DropdownOption,
} from '../RoadmapFormModal.styles';

const TeamStep: React.FC<FormStepProps> = ({ data, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTeam = data.teamId
    ? TEAM_OPTIONS.find((option) => option.id === data.teamId)
    : null;

  const handleTeamSelect = (teamId: string) => {
    onUpdate({ teamId });
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedTeam) {
      return selectedTeam.label;
    }
    return '팀을 선택해주세요';
  };

  const hasSelection = !!data.teamId;

  return (
    <DropdownContainer>
      <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
        팀
      </Text>

      <div style={{ position: 'relative' }}>
        <DropdownHeader
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
        </DropdownHeader>

        <DropdownList $isOpen={isOpen}>
          {TEAM_OPTIONS.map((option) => (
            <DropdownOption
              key={option.id}
              onClick={() => handleTeamSelect(option.id)}
              $highlighted={data.teamId === option.id}
            >
              <Text as="span" variant="B1" color={tokens.colors.neutral[600]}>
                {option.label}
              </Text>
            </DropdownOption>
          ))}
        </DropdownList>
      </div>
    </DropdownContainer>
  );
};

export default TeamStep;
