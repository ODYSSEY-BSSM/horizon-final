'use client';

import styled from '@emotion/styled';
import ContinueWithGoogle from '@/components/auth/ContinueWithGoogle';
import { Text } from '@/shared/ui';
import { TextField } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import { SecondaryAction } from '../../components/signup/SecondaryAction';
import { useEmailForm } from '../../hooks/signup/useEmailForm';

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
    <StyledContainer>
      <form onSubmit={onSubmit}>
        <StyledFormContent>
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
            <StyledButtonSection>
              <StyledSubmitButton type="submit" disabled={isSubmitting}>
                <Text variant="ST" color={tokens.colors.white}>
                  {isSubmitting ? '전송 중...' : '인증번호 보내기'}
                </Text>
              </StyledSubmitButton>
            </StyledButtonSection>
          </StyledActionsWrapper>
        </StyledFormContent>
      </form>
      <StyledDividerWrapper>
        <StyledDividerLine />
        <StyledDividerText>
          <Text variant="O" color={tokens.colors.neutral[400]}>
            또는
          </Text>
        </StyledDividerText>
      </StyledDividerWrapper>
      <ContinueWithGoogle onClick={onGoogleSignUp} />
      <SecondaryAction
        primaryText="이미 계정이 있으신가요?"
        actionText="로그인하기"
        onActionClick={onSignIn}
      />
    </StyledContainer>
  );
};

export default EmailStep;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const StyledFormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 82px;
  width: 100%;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const StyledButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const StyledDividerWrapper = styled.div`
  position: relative;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDividerLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: ${tokens.colors.neutral[400]};
`;

const StyledDividerText = styled.div`
  background-color: ${tokens.colors.white};
  padding: 0 16px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;
