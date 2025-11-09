'use client';

import styled from '@emotion/styled';
import { useId, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
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
        onClick={() => setIsOpen(!isOpen)}
        aria-label="팀 선택"
        aria-expanded={isOpen}
      >
        <StyledTeamName>{selectedTeam ? selectedTeam.name : '팀 선택'}</StyledTeamName>
        <Icon
          name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          variant="LG"
          color={tokens.colors.neutral[900]}
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
              {team.name}
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

const StyledDropdownHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${tokens.colors.neutral[900]};
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const StyledTeamName = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  letter-spacing: -0.015em;
  color: ${tokens.colors.neutral[900]};
`;

const StyledDropdownList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 200px;
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
  height: 44px;
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${({ $selected }) =>
    $selected ? tokens.colors.primary[100] : tokens.colors.white};
  border: none;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  text-align: left;
  
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[800]};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;
