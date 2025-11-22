'use client';

import styled from '@emotion/styled';
import { PrimaryButton } from '@/feature/auth';
import { PasswordValidation } from '@/feature/auth/components/signup/PasswordValidation';
import { usePasswordForm } from '@/feature/auth/hooks/usePasswordForm';
import { tokens } from '@/shared/tokens';
import { Text, TextField } from '@/shared/ui';

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
    <StyledForm onSubmit={onSubmit}>
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

      <PrimaryButton type="submit" disabled={isSubmitting || !passwordValidation.isValid}>
        <Text variant="ST" color={tokens.colors.white}>
          {isSubmitting ? '설정 중...' : '완료'}
        </Text>
      </PrimaryButton>
    </StyledForm>
  );
};

export default PasswordStep;

const StyledForm = styled.form`
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
