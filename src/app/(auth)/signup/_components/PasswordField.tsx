import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/core/tokens';
import type { TextFieldProps } from '@/components/common/TextField/TextField.types';

interface ValidationProps {
  isValid: boolean;
  text: string;
}

const Validation = ({ isValid, text }: ValidationProps) => (
  <StyledValidationWrapper>
    <Icon
      name={isValid ? 'check' : 'close'}
      color={isValid ? tokens.colors.success[200] : tokens.colors.error[200]}
      size="16px"
    />
    <Text variant="C" color={isValid ? tokens.colors.success[200] : tokens.colors.error[200]}>
      {text}
    </Text>
  </StyledValidationWrapper>
);

interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
  value: string;
}

const PasswordField = ({ value, ...props }: PasswordFieldProps) => {
  const validations = {
    length: value.length >= 8 && value.length <= 20,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    letter: /[a-zA-Z]/.test(value),
    number: /\d/.test(value),
  };

  return (
    <div>
      <TextField type="password" value={value} {...props} />
      <StyledValidationContainer>
        <Validation isValid={validations.length} text="8-20자" />
        <Validation isValid={validations.specialChar} text="특수문자 포함" />
        <Validation isValid={validations.letter} text="영문 포함" />
        <Validation isValid={validations.number} text="숫자 포함" />
      </StyledValidationContainer>
    </div>
  );
};

export default PasswordField;

const StyledValidationContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const StyledValidationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
