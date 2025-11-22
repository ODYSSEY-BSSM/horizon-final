'use client';

import styled from '@emotion/styled';
import { PrimaryButton, TextDivider } from '@/feature/auth';
import ContinueWithGoogle from '@/feature/auth/components/ContinueWithGoogle';
import { SecondaryAction } from '@/feature/auth/components/signup/SecondaryAction';
import { useEmailForm } from '@/feature/auth/hooks/useEmailForm';
import { tokens } from '@/shared/tokens';
import { Text, TextField } from '@/shared/ui';

interface EmailStepProps {
  onGoogleSignUp: () => void;
  onSignIn: () => void;
}

const EmailStep = ({ onGoogleSignUp, onSignIn }: EmailStepProps) => {
  const {
    register,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useEmailForm();

  return (
    <StyledContainer onSubmit={onSubmit}>
      <TextField
        label="이메일"
        placeholder="이메일 입력"
        type="email"
        width="100%"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <StyledActionsWrapper>
        <StyledButtonGroup>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            <Text variant="ST" color={tokens.colors.white}>
              {isSubmitting ? '전송 중...' : '인증번호 보내기'}
            </Text>
          </PrimaryButton>
          <TextDivider />
          <ContinueWithGoogle onClick={onGoogleSignUp} disabled />
        </StyledButtonGroup>
        <SecondaryAction
          primaryText="이미 계정이 있으신가요?"
          actionText="로그인하기"
          onActionClick={onSignIn}
        />
      </StyledActionsWrapper>
    </StyledContainer>
  );
};

export default EmailStep;

const StyledContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 82px;
  width: 100%;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  width: 100%;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;
