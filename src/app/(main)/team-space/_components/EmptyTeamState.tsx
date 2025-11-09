'use client';

import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

interface EmptyTeamStateProps {
  onCreateTeam: () => void;
  onJoinTeam: () => void;
}

const EmptyTeamState = ({ onCreateTeam, onJoinTeam }: EmptyTeamStateProps) => {
  return (
    <StyledContainer>
      <Text as="p" variant="B1" color={tokens.colors.neutral[800]}>
        참여중인 팀이 없어요.
        <br />새 팀을 만들거나, 초대코드로 참여해 보세요.
      </Text>
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
  min-height: 500px;
  text-align: center;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;
