'use client';

import styled from '@emotion/styled';
import { SecondaryAction } from '@/feature/auth/components/signup/SecondaryAction';
import { VerificationInput } from '@/feature/auth/components/signup/VerificationInput';
import { useVerificationForm } from '@/feature/auth/hooks/useVerificationForm';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';

const VerificationStep = () => {
  const {
    watch,
    setValue,
    formState: { errors, isSubmitting },
    onSubmit,
    onResendCode,
  } = useVerificationForm();

  const verificationCode = watch('verificationCode');

  return (
    <StyledContainer>
      <form onSubmit={onSubmit}>
        <VerificationInput
          value={verificationCode}
          onChange={(value) => setValue('verificationCode', value)}
          error={errors.verificationCode?.message}
        />
        <StyledButtonSection>
          <StyledSubmitButton type="submit" disabled={isSubmitting}>
            <Text variant="ST" color={tokens.colors.white}>
              {isSubmitting ? '인증 중...' : '확인'}
            </Text>
          </StyledSubmitButton>

          <SecondaryAction
            primaryText="인증번호를 받지 못했나요?"
            actionText="다시 보내기"
            onActionClick={onResendCode}
            showTimer={true}
            timerDuration={30}
          />
        </StyledButtonSection>
      </form>
    </StyledContainer>
  );
};

export default VerificationStep;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const StyledButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledSubmitButton = styled.button<{ disabled: boolean }>`
  width: 400px;
  height: 48px;
  background-color: ${({ disabled }) => (disabled ? tokens.colors.neutral[300] : tokens.colors.primary[500])};
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;
  align-self: center;

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
