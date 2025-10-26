import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
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

  if (showTimer) {
    return (
      <StyledTimerWrapper>
        <StyledTextRow>
          <StyledText $color={tokens.colors.neutral[600]}>{primaryText}</StyledText>
          <StyledActionButton
            onClick={handleActionClick}
            disabled={isTimerActive}
            isActive={!isTimerActive}
          >
            <StyledText
              $color={isTimerActive ? tokens.colors.primary[400] : tokens.colors.primary[500]}
            >
              {actionText}
            </StyledText>
          </StyledActionButton>
        </StyledTextRow>
        {isTimerActive && (
          <StyledText $color={tokens.colors.neutral[400]}>
            ({timeLeft}초 후 다시 보내기)
          </StyledText>
        )}
      </StyledTimerWrapper>
    );
  }

  return (
    <StyledCenterWrapper>
      <StyledTextRow>
        <StyledText $color={tokens.colors.neutral[600]}>{primaryText}</StyledText>
        <StyledActionButton onClick={onActionClick} isActive={true}>
          <StyledText $color={tokens.colors.primary[500]}>{actionText}</StyledText>
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
  gap: 0;
`;

const StyledTextRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: start;
  justify-content: center;
`;

const StyledText = styled.p<{ $color: string }>`
  font-family: SUIT Variable, system-ui, -apple-system, sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ $color }) => $color};
  text-align: center;
  white-space: pre;
  margin: 0;
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
  
  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.8)};
  }
`;
