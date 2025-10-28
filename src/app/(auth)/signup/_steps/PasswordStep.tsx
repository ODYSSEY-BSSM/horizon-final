'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { flex } from '@/core/styles';
import { tokens } from '@/core/tokens';
import type { PasswordStepProps } from '@/core/types';
import PasswordValidation from '../_components/PasswordValidation';

const PasswordStep = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  isLoading,
  errors,
}: PasswordStepProps) => {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isPasswordValid = hasMinLength && hasNumber && hasSpecialChar;

  const getValidationState = (condition: boolean): boolean | null => {
    if (password.length === 0) {
      return null;
    }
    return condition;
  };

  return (
    <StyledContainer>
      <StyledFieldsWrapper>
        <StyledPasswordFieldWrapper>
          <TextField
            label="비밀번호"
            placeholder="비밀번호 입력"
            type="password"
            width="100%"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
          />
          <StyledValidationsWrapper>
            <PasswordValidation text="8자 이상" isValid={getValidationState(hasMinLength)} />
            <PasswordValidation text="숫자 포함" isValid={getValidationState(hasNumber)} />
            <PasswordValidation text="기호 포함" isValid={getValidationState(hasSpecialChar)} />
          </StyledValidationsWrapper>
        </StyledPasswordFieldWrapper>

        <TextField
          label="비밀번호 확인"
          placeholder="비밀번호 재입력"
          type="password"
          width="100%"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
      </StyledFieldsWrapper>

      <StyledSubmitButton
        onClick={onSubmit}
        disabled={
          !password.trim() ||
          !confirmPassword.trim() ||
          !!errors.password ||
          !!errors.confirmPassword ||
          !isPasswordValid ||
          isLoading
        }
      >
        <Text variant="ST" color={tokens.colors.white}>
          {isLoading ? '설정 중...' : '완료'}
        </Text>
      </StyledSubmitButton>
    </StyledContainer>
  );
};

export default PasswordStep;

const StyledContainer = styled.div`
  ${flex.column}
  ${flex.gap(62)}
  width: 100%;
`;

const StyledFieldsWrapper = styled.div`
  ${flex.column}
  ${flex.gap(16)}
`;

const StyledPasswordFieldWrapper = styled.div`
  ${flex.column}
  ${flex.gap(8)}
`;

const StyledValidationsWrapper = styled.div`
  ${flex.rowCenter}
  ${flex.gap(8)}
`;

const StyledSubmitButton = styled.button<{ disabled: boolean }>`
  ${flex.center}
  width: 100%;
  height: 48px;
  background-color: ${({ disabled }) => (disabled ? tokens.colors.neutral[300] : tokens.colors.primary[500])};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ disabled }) => (disabled ? tokens.colors.neutral[300] : tokens.colors.primary[600])};
  }
  
  &:disabled {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ disabled }) => (disabled ? tokens.colors.neutral[400] : tokens.colors.primary[600])};
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;
