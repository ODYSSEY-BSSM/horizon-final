'use client';

import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import type { Team } from '@/lib/types/team';
import { tokens } from '@/shared/tokens';
import TeamDropdown from '../_components/TeamDropdown';

interface TeamSpaceHeaderProps {
  teams: Team[];
  selectedTeamId: string | null;
  onTeamChange: (teamId: string) => void;
  onAddFolder: () => void;
  onInviteTeam: () => void;
}

const TeamSpaceHeader = ({
  teams,
  selectedTeamId,
  onTeamChange,
  onAddFolder,
  onInviteTeam,
}: TeamSpaceHeaderProps) => {
  return (
    <StyledHeader>
      <StyledLeft>
        <TeamDropdown teams={teams} selectedTeamId={selectedTeamId} onChange={onTeamChange} />
      </StyledLeft>
      <StyledRight>
        <Button
          variant="contained"
          size="medium"
          iconPosition="left"
          iconName="add"
          onClick={onAddFolder}
        >
          새 폴더
        </Button>
        <Button variant="outlined" size="medium" onClick={onInviteTeam}>
          팀 초대
        </Button>
      </StyledRight>
    </StyledHeader>
  );
};

export default TeamSpaceHeader;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledLeft = styled.div`
  display: flex;
  align-items: center;
`;

const StyledRight = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  align-items: center;
`;
