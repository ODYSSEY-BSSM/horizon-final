'use client';

import styled from '@emotion/styled';
import ContinueWithGoogle from '@/components/auth/ContinueWithGoogle';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { flex, spacing } from '@/core/styles';
import { tokens } from '@/core/tokens';
import type { EmailStepProps } from '@/core/types';
import SecondaryAction from '../_components/SecondaryAction';

const EmailStep = ({
  email,
  setEmail,
  onSubmit,
  isLoading,
  errors,
  onGoogleSignUp,
  onSignIn,
}: EmailStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !!errors.email || isLoading) {
      return;
    }
    onSubmit(e);
  };

  return (
    <StyledContainer>
      <form onSubmit={handleSubmit}>
        <StyledFormContent>
          <TextField
            label="이메일"
            placeholder="이메일 입력"
            type="email"
            width="100%"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <StyledActionsWrapper>
            <StyledButtonSection>
              <StyledSubmitButton
                type="submit"
                disabled={!email.trim() || !!errors.email || isLoading}
              >
                <Text variant="ST" color={tokens.colors.white}>
                  {isLoading ? '전송 중...' : '인증번호 보내기'}
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
  ${flex.column}
  ${flex.gap(12)}
  width: 100%;
`;

const StyledFormContent = styled.div`
  ${flex.column}
  ${flex.gap(82)}
  width: 100%;
`;

const StyledActionsWrapper = styled.div`
  ${flex.column}
  ${flex.gap(40)}
`;

const StyledButtonSection = styled.div`
  ${flex.column}
  ${flex.gap(12)}
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

const StyledDividerWrapper = styled.div`
  ${flex.center}
  position: relative;
  height: 40px;
  width: 100%;
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
  ${flex.center}
  ${spacing.pl(16)}
  ${spacing.pr(16)}
  background-color: ${tokens.colors.white};
  height: 32px;
  position: absolute;
`;
