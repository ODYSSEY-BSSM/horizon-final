'use client';

import styled from '@emotion/styled';
import { useId, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import type { Team } from '@/lib/types/team';
import { tokens } from '@/shared/tokens';

interface TeamDropdownProps {
  teams: Team[];
  selectedTeamId: string | null;
  onChange: (teamId: string) => void;
}

const TeamDropdown = ({ teams, selectedTeamId, onChange }: TeamDropdownProps) => {
  const labelId = useId();
  const buttonId = `${labelId}-button`;
  const [isOpen, setIsOpen] = useState(false);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  return (
    <StyledContainer>
      <StyledDropdownHeader
        type="button"
        id={buttonId}
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        $isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="팀 선택"
        aria-expanded={isOpen}
      >
        <Text as="span" variant="H3" color={tokens.colors.neutral[800]}>
          {selectedTeam ? selectedTeam.name : '팀 선택'}
        </Text>
        <Icon
          name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
          variant="SM"
          color={tokens.colors.neutral[600]}
          decorative
        />
      </StyledDropdownHeader>

      {isOpen && (
        <StyledDropdownList role="listbox">
          {teams.map((team) => (
            <StyledTeamOption
              type="button"
              key={team.id}
              $selected={selectedTeamId === team.id}
              onClick={() => {
                onChange(team.id);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedTeamId === team.id}
            >
              <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                {team.name}
              </Text>
            </StyledTeamOption>
          ))}
        </StyledDropdownList>
      )}
    </StyledContainer>
  );
};

export default TeamDropdown;

const StyledContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const StyledDropdownHeader = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  height: 34px;
  padding: 0 ${tokens.spacing.small};
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

const StyledDropdownList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 145px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  z-index: 10000;
  max-height: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const StyledTeamOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  height: 40px;
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${({ $selected }) =>
    $selected ? tokens.colors.primary[100] : tokens.colors.white};
  border: none;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;
