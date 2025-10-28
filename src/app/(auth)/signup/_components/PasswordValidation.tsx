'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

interface PasswordValidationProps {
  text: string;
  isValid: boolean | null;
}

const PasswordValidation = ({ text, isValid }: PasswordValidationProps) => {
  const iconName = isValid === true ? 'check' : 'close';

  const color =
    isValid === null
      ? tokens.colors.neutral[500]
      : isValid
        ? tokens.colors.success[200]
        : tokens.colors.error[200];

  return (
    <StyledContainer>
      <Icon name={iconName} variant="SM" color={color} />
      <Text variant="B1" color={color}>
        {text}
      </Text>
    </StyledContainer>
  );
};

export default PasswordValidation;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;
