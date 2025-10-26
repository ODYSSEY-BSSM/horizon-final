import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

interface SecondaryActionProps {
  primaryText: string;
  actionText: string;
  onActionClick?: () => void;
  showTimer?: boolean;
  timerDuration?: number;
}

const SecondaryAction = ({
  primaryText,
  actionText,
  onActionClick,
  showTimer = false,
  timerDuration = 30,
}: SecondaryActionProps) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerActive, setIsTimerActive] = useState(showTimer);

  useEffect(() => {
    if (showTimer) {
      setTimeLeft(timerDuration);
      setIsTimerActive(true);
    }
  }, [showTimer, timerDuration]);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0) {
      setIsTimerActive(false);
    }
  }, [isTimerActive, timeLeft]);

  const handleActionClick = () => {
    if (showTimer) {
      setTimeLeft(timerDuration);
      setIsTimerActive(true);
    }
    onActionClick?.();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  if (showTimer) {
    return (
      <StyledTimerWrapper>
        <StyledTimerContainer>
          <StyledTextRow>
            <Text
              variant="B2"
              color={tokens.colors.neutral[600]}
            >
              {primaryText}
            </Text>
            <StyledActionButton
              onClick={handleActionClick}
              disabled={isTimerActive}
              isActive={!isTimerActive}
            >
              <Text
                variant="B2"
                color={isTimerActive ? tokens.colors.neutral[400] : tokens.colors.primary[500]}
              >
                {actionText} {isTimerActive && `(${formatTime(timeLeft)})`}
              </Text>
            </StyledActionButton>
          </StyledTextRow>
        </StyledTimerContainer>
      </StyledTimerWrapper>
    );
  }

  return (
    <StyledCenterWrapper>
      <StyledTextRow>
        <Text
          variant="B2"
          color={tokens.colors.neutral[600]}
          style={{ fontSize: '14px', lineHeight: '20px' }}
        >
          {primaryText}
        </Text>
        <StyledActionButton onClick={onActionClick} isActive={true}>
          <Text
            variant="B2"
            color={tokens.colors.primary[500]}
            style={{ fontSize: '14px', lineHeight: '20px' }}
          >
            {actionText}
          </Text>
        </StyledActionButton>
      </StyledTextRow>
    </StyledCenterWrapper>
  );
};

export default SecondaryAction;

const StyledTimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`;

const StyledTextRow = styled.div`
  display: flex;
  gap: 4px;
`;

const StyledCenterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledActionButton = styled.button<{ isActive: boolean; disabled?: boolean }>`
  border: none;
  background: none;
  padding: 0;
  cursor: ${({ isActive, disabled }) => (disabled || !isActive ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  
  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.6 : 0.8)};
  }
`;
