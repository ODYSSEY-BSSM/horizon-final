'use client';

import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';

interface GreetingMessageProps {
  className?: string;
  userName?: string;
  date?: string;
}

const GreetingMessage = ({ userName = '홍길동', date, className }: GreetingMessageProps) => {
  const currentDate = useMemo(() => {
    return dayjs().format('YYYY.MM.DD');
  }, []);

  const displayDate = date || currentDate;

  return (
    <StyledGreetingMessageContainer className={className}>
      <Text as="span" variant="ST" color={tokens.colors.neutral[600]}>
        {displayDate}
      </Text>
      <StyledGreetingContainer>
        <Text as="span" variant="H2" color={tokens.colors.black}>
          &gt;
        </Text>
        <Text as="span" variant="H2" color={tokens.colors.black}>
          {userName}님, 돌아오셨군요!
        </Text>
      </StyledGreetingContainer>
    </StyledGreetingMessageContainer>
  );
};

export default GreetingMessage;

const StyledGreetingMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
`;

const StyledGreetingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
`;
