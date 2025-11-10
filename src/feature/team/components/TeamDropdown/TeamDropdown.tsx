'use client';

import styled from '@emotion/styled';
import { useId, useState } from 'react';
import type { Team } from '@/feature/team/types/team';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';

interface TeamDropdownProps {
  teams: Team[];
  selectedTeamId: string | null;
  onChange: (teamId: string) => void;
  onCreateTeam?: () => void;
}

const TeamDropdown = ({ teams, selectedTeamId, onChange, onCreateTeam }: TeamDropdownProps) => {
  const labelId = useId();
  const buttonId = `${labelId}-button`;
  const [isOpen, setIsOpen] = useState(false);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  const handleCreateTeam = () => {
    setIsOpen(false);
    onCreateTeam?.();
  };

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
        <StyledIconWrapper>
          <Icon
            name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            size={32}
            color={tokens.colors.neutral[800]}
            decorative
          />
        </StyledIconWrapper>
      </StyledDropdownHeader>

      {isOpen && (
        <StyledDropdownContent>
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
          {onCreateTeam && (
            <StyledCreateTeamOption type="button" onClick={handleCreateTeam}>
              <Icon name="add" size={20} color={tokens.colors.neutral[600]} decorative />
              <span>팀 생성</span>
            </StyledCreateTeamOption>
          )}
        </StyledDropdownContent>
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
  color: ${tokens.colors.neutral[800]};
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

const StyledIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

const StyledTeamName = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  letter-spacing: -0.015em;
  color: ${tokens.colors.neutral[800]};
`;

const StyledDropdownContent = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 240px;
  background-color: ${tokens.colors.white};
  border: 1px solid #cdd5e1;
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  z-index: 10000;
  max-height: 336px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledDropdownList = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

const StyledCreateTeamOption = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 12px;
  background-color: ${tokens.colors.white};
  border: none;
  border-top: 1px solid ${tokens.colors.neutral[200]};
  cursor: pointer;
  width: 100%;
  text-align: left;

  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[600]};

  &:hover {
    background-color: ${tokens.colors.neutral[200]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: -2px;
  }
`;

const StyledTeamOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  background-color: ${tokens.colors.white};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  text-align: left;

  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[600]};

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: -2px;
  }
`;
