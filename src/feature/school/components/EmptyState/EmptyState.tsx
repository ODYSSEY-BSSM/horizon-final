'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Button, Text } from '@/shared/ui';

interface EmptyStateProps {
  onConnect: () => void;
}

const EmptyState = ({ onConnect }: EmptyStateProps) => {
  return (
    <StyledContainer>
      <StyledContent>
        <StyledText as="p" variant="H3" color={tokens.colors.black}>
          연동된 학교가 없어요. <br />
          학교에서 지급받은 구글 계정으로 연동할 수 있어요.
        </StyledText>
        <Button
          variant="contained"
          size="medium"
          iconPosition="left"
          iconName="device_hub"
          onClick={onConnect}
        >
          연동하기
        </Button>
      </StyledContent>
    </StyledContainer>
  );
};

export default EmptyState;

const StyledContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.xlarge};
  max-width: 395px;
  text-align: center;
`;

const StyledText = styled(Text)`
    text-align: center;
`;
