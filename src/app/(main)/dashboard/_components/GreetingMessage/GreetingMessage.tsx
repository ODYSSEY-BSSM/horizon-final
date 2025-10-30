'use client';

import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { useGreetingMessage } from './GreetingMessage.hooks';
import { Container, GreetingContainer } from './GreetingMessage.styles';
import type { GreetingMessageProps } from './GreetingMessage.types';

const GreetingMessage = ({ userName = '홍길동', date, className }: GreetingMessageProps) => {
  const { currentDate } = useGreetingMessage();
  const displayDate = date || currentDate;

  return (
    <Container className={className} data-node-id="4510:2271">
      <Text as="span" variant="ST" color={tokens.colors.neutral[600]}>
        {displayDate}
      </Text>
      <GreetingContainer>
        <Text as="span" variant="H2" color={tokens.colors.black}>
          &gt;
        </Text>
        <Text as="span" variant="H2" color={tokens.colors.black}>
          {userName}님, 돌아오셨군요!
        </Text>
      </GreetingContainer>
    </Container>
  );
};

export default GreetingMessage;
