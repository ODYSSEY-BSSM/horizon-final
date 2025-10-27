'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ContinueWithGoogle from '@/components/auth/ContinueWithGoogle';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/core/tokens';
import SecondaryAction from './_components/SecondaryAction';
import { useLogin } from './_hooks/useSignIn';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const loginMutation = useLogin();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormValid) {
      return;
    }

    await loginMutation.mutateAsync({
      email,
      password,
    });
    router.push('/');
  };

  const handleGoogleLogin = () => {
    // TODO: Google OAuth 흐름 구현 필요 (window.location.href = '/api/auth/google')
    // router.push('/');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <StyledContentWrapper>
      <StyledHeaderWrapper>
        <Text variant="H2" color={tokens.colors.primary[500]}>
          HORIZON
        </Text>
        <Text variant="B1" color={tokens.colors.neutral[500]}>
          환영합니다, 로그인을 진행해주세요.
        </Text>
      </StyledHeaderWrapper>

      <StyledFormWrapper>
        <TextField
          label="이메일"
          placeholder="이메일 입력"
          type="email"
          leftIcon="person"
          width="100%"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호"
          placeholder="비밀번호 입력"
          type="password"
          leftIcon="lock"
          width="100%"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </StyledFormWrapper>

      <StyledActionsWrapper>
        <StyledButtonGroup>
          <StyledLoginButton
            disabled={!isFormValid || loginMutation.isPending}
            onClick={handleLogin}
          >
            <Text variant="ST" color={tokens.colors.white}>
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </Text>
          </StyledLoginButton>

          <StyledDividerWrapper>
            <StyledDividerLine />
            <StyledDividerText>
              <Text variant="O" color={tokens.colors.neutral[400]}>
                또는
              </Text>
            </StyledDividerText>
          </StyledDividerWrapper>

          <ContinueWithGoogle onClick={handleGoogleLogin} />
        </StyledButtonGroup>

        <SecondaryAction onSignUpClick={handleSignUp} />
      </StyledActionsWrapper>
    </StyledContentWrapper>
  );
}

const StyledContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

const StyledLoginButton = styled.button<{ disabled: boolean }>`
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

const StyledHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 400px;
`;

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 400px;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 400px;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
