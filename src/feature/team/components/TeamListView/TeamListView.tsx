'use client';

import styled from '@emotion/styled';
import type { TeamInfo } from '@/feature/team/types/teamApi';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';

interface TeamListViewProps {
  teams: TeamInfo[];
  onTeamClick: (teamId: number) => void;
}

const TeamListView = ({ teams, onTeamClick }: TeamListViewProps) => {
  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>참여중인 팀</StyledTitle>
        <StyledTeamCount>{teams.length}개</StyledTeamCount>
      </StyledHeader>
      <StyledGrid>
        {teams.map((team) => (
          <StyledTeamCard key={team.id} onClick={() => onTeamClick(team.id)}>
            <StyledIconWrapper>
              <Icon name="group" size={24} color={tokens.colors.primary[500]} />
            </StyledIconWrapper>
            <StyledTeamInfo>
              <StyledTeamName>{team.name}</StyledTeamName>
              <StyledTeamId>팀 ID: {team.id}</StyledTeamId>
            </StyledTeamInfo>
            <StyledArrowIcon>
              <Icon name="arrow_forward" size={20} color={tokens.colors.neutral[400]} />
            </StyledArrowIcon>
          </StyledTeamCard>
        ))}
      </StyledGrid>
    </StyledContainer>
  );
};

export default TeamListView;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const StyledTitle = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  color: ${tokens.colors.black};
  margin: 0;
`;

const StyledTeamCount = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.medium};
  color: ${tokens.colors.neutral[600]};
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  width: 100%;
`;

const StyledTeamCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${tokens.colors.primary[100]};
  border-radius: ${tokens.radius.small};
  flex-shrink: 0;
`;

const StyledTeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const StyledTeamName = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.black};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTeamId = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.medium};
  color: ${tokens.colors.neutral[500]};
  margin: 0;
`;

const StyledArrowIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  ${StyledTeamCard}:hover & {
    opacity: 1;
  }
`;
