'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/shared/tokens';
import PasswordValidation from '../_components/PasswordValidation';
import { usePasswordForm } from '../_hooks/usePasswordForm';

const PasswordStep = () => {
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    onSubmit,
    passwordValidation,
  } = usePasswordForm();

  const password = watch('password');

  const getValidationState = (condition: boolean): boolean | null => {
    if (password.length === 0) {
      return null;
    }
    return condition;
  };

  return (
    <StyledContainer>
      <form onSubmit={onSubmit}>
        <StyledFieldsWrapper>
          <StyledPasswordFieldWrapper>
            <TextField
              label="비밀번호"
              placeholder="비밀번호 입력"
              type="password"
              width="100%"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <StyledValidationsWrapper>
              <PasswordValidation
                text="8자 이상"
                isValid={getValidationState(passwordValidation.hasMinLength)}
              />
              <PasswordValidation
                text="숫자 포함"
                isValid={getValidationState(passwordValidation.hasNumber)}
              />
              <PasswordValidation
                text="기호 포함"
                isValid={getValidationState(passwordValidation.hasSpecialChar)}
              />
            </StyledValidationsWrapper>
          </StyledPasswordFieldWrapper>

          <TextField
            label="비밀번호 확인"
            placeholder="비밀번호 재입력"
            type="password"
            width="100%"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </StyledFieldsWrapper>

        <StyledSubmitButton type="submit" disabled={isSubmitting || !passwordValidation.isValid}>
          <Text variant="ST" color={tokens.colors.white}>
            {isSubmitting ? '설정 중...' : '완료'}
          </Text>
        </StyledSubmitButton>
      </form>
    </StyledContainer>
  );
};

export default PasswordStep;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 62px;
  width: 100%;
`;

const StyledFieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledPasswordFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledValidationsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledSubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  height: 48px;
  background-color: ${({ disabled }) => (disabled ? tokens.colors.neutral[300] : tokens.colors.primary[500])};
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
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
