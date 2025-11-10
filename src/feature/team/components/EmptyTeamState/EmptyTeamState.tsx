'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Button } from '@/shared/ui';

interface EmptyTeamStateProps {
  onCreateTeam: () => void;
  onJoinTeam: () => void;
}

const EmptyTeamState = ({ onCreateTeam, onJoinTeam }: EmptyTeamStateProps) => {
  return (
    <StyledContainer>
      <StyledMessage>
        참여중인 팀이 없어요.
        <br />새 팀을 만들거나, 초대코드로 참여해 보세요.
      </StyledMessage>
      <StyledButtonGroup>
        <Button size="medium" variant="contained" onClick={onCreateTeam}>
          팀 생성하기
        </Button>
        <Button size="medium" variant="outlined" onClick={onJoinTeam}>
          팀 참여하기
        </Button>
      </StyledButtonGroup>
    </StyledContainer>
  );
};

export default EmptyTeamState;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 345px;
`;

const StyledMessage = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[20]};
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: ${tokens.typos.lineHeight[28]};
  letter-spacing: -0.02em;
  color: ${tokens.colors.black};
  text-align: center;
  margin: 0;
  width: 100%;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
