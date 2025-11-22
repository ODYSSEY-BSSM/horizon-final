'use client';

import styled from '@emotion/styled';
import { PrimaryButton } from '@/feature/auth';
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
    <StyledContainer onSubmit={onSubmit}>
      <VerificationInput
        value={verificationCode}
        onChange={(value) => setValue('verificationCode', value)}
        error={errors.verificationCode?.message}
      />
      <StyledButtonSection>
        <PrimaryButton type="submit" disabled={isSubmitting} width="400px">
          <Text variant="ST" color={tokens.colors.white}>
            {isSubmitting ? '인증 중...' : '확인'}
          </Text>
        </PrimaryButton>

        <SecondaryAction
          primaryText="인증번호를 받지 못했나요?"
          actionText="다시 보내기"
          onActionClick={onResendCode}
          showTimer={true}
          timerDuration={30}
        />
      </StyledButtonSection>
    </StyledContainer>
  );
};

export default VerificationStep;

const StyledContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 62px;
`;

const StyledButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
`;
