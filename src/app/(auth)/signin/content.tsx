'use client';

import styled from '@emotion/styled';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  PrimaryButton,
  SignUpSecondaryAction as SecondaryAction,
  TextDivider,
  useLogin,
} from '@/feature/auth';
import ContinueWithGoogle from '@/feature/auth/components/ContinueWithGoogle';
import { useToast } from '@/shared/hooks/useToast';
import { tokens } from '@/shared/tokens';
import { Text, TextField } from '@/shared/ui';

export default function SignInContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const loginMutation = useLogin();

  // URL query parameter로 전달된 메시지 처리
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'loginRequired') {
      toast({
        description: '로그인이 필요한 서비스입니다.',
        variant: 'failed',
      });
    }
  }, [searchParams, toast]);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) {
      return;
    }

    try {
      setError(null);
      await loginMutation.mutateAsync({
        email,
        password,
      });
      router.push('/dashboard');
    } catch (_err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Google OAuth 흐름 구현 필요 (window.location.href = '/api/auth/google')
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <StyledPageWrapper>
      <StyledContentCard>
        <StyledHeaderWrapper>
          <Text variant="H2" color={tokens.colors.primary[500]}>
            HORIZON
          </Text>
          <Text variant="B1" color={tokens.colors.neutral[500]}>
            환영합니다, 로그인을 진행해주세요.
          </Text>
        </StyledHeaderWrapper>

        <StyledForm onSubmit={handleLogin}>
          <StyledFieldsWrapper>
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
            {error && (
              <StyledErrorMessage>
                <Text variant="O" color={tokens.colors.error[200]}>
                  {error}
                </Text>
              </StyledErrorMessage>
            )}
          </StyledFieldsWrapper>

          <StyledActionsWrapper>
            <StyledButtonGroup>
              <PrimaryButton type="submit" disabled={!isFormValid || loginMutation.isPending}>
                <Text variant="ST" color={tokens.colors.white}>
                  {loginMutation.isPending ? '로그인 중...' : '로그인'}
                </Text>
              </PrimaryButton>

              <TextDivider />

              <ContinueWithGoogle onClick={handleGoogleLogin} disabled />
            </StyledButtonGroup>

            <SecondaryAction
              primaryText="아직 계정이 없으신가요?"
              actionText="회원가입하기"
              onActionClick={handleSignUp}
              align="flex-start"
            />
          </StyledActionsWrapper>
        </StyledForm>
      </StyledContentCard>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${tokens.colors.background};
`;

const StyledContentCard = styled.div`
    width: 720px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 60px;
  background-color: ${tokens.colors.white};
  box-shadow: 1px 2px 8px 2px rgba(0, 0, 0, 0.1);
`;

const StyledHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 400px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 60px;
  width: 400px;
`;

const StyledFieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledErrorMessage = styled.div`
  padding: 8px 12px;
  background-color: ${tokens.colors.error[100]};
  border-radius: 4px;
  border: 1px solid ${tokens.colors.error[200]};
`;
