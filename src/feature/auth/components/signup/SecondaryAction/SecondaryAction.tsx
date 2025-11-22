'use client';

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';

interface SecondaryActionProps {
  primaryText: string;
  actionText: string;
  onActionClick?: () => void;
  showTimer?: boolean;
  timerDuration?: number;
  align?: 'center' | 'flex-start';
}

const SecondaryAction = ({
  primaryText,
  actionText,
  onActionClick,
  showTimer = false,
  timerDuration = 30,
  align = 'center',
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
          <Text variant="B2" color={tokens.colors.neutral[600]}>
            {primaryText}
          </Text>
          <StyledActionButton
            onClick={handleActionClick}
            disabled={isTimerActive}
            isActive={!isTimerActive}
          >
            <Text
              variant="B2"
              color={isTimerActive ? tokens.colors.primary[400] : tokens.colors.primary[500]}
            >
              {actionText}
            </Text>
          </StyledActionButton>
        </StyledTextRow>
        {isTimerActive && (
          <Text variant="B2" color={tokens.colors.neutral[400]}>
            ({timeLeft}초 후 다시 보내기)
          </Text>
        )}
      </StyledTimerWrapper>
    );
  }

  return (
    <StyledWrapper align={align}>
      <StyledTextRow>
        <Text variant="B2" color={tokens.colors.neutral[600]}>
          {primaryText}
        </Text>
        <Text
          as="button"
          type="button"
          variant="B2"
          color={tokens.colors.primary[500]}
          onClick={onActionClick}
          style={{ cursor: 'pointer' }}
        >
          {actionText}
        </Text>
      </StyledTextRow>
    </StyledWrapper>
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

const StyledWrapper = styled.div<{ align: 'center' | 'flex-start' }>`
  display: flex;
  justify-content: ${({ align }) => align};
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
