'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/ui';
import { Text } from '@/shared/ui';
import { useSignupFlow } from '@/lib/stores/signupFlow';
import type { SignUpStep } from '@/lib/types';
import { tokens } from '@/shared/tokens';
import {
  EmailStep,
  PasswordStep,
  UsernameStep,
  VerificationStep,
} from '@/feature/auth';

export default function SignUpContent() {
  const { currentStep, completedData, goToStep } = useSignupFlow();
  const router = useRouter();

  const handleGoogleSignUp = () => {
    // TODO: Google OAuth 흐름 구현 필요
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleBack = () => {
    const stepOrder: SignUpStep[] = ['email', 'verification', 'password', 'username'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = stepOrder[currentIndex - 1];
      goToStep(previousStep);
    } else {
      router.back();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'email':
        return '회원가입';
      case 'verification':
        return '인증번호 입력';
      case 'password':
        return '비밀번호 설정';
      case 'username':
        return '사용자 이름';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'email':
        return '이메일 주소를 입력하고 인증을 완료하세요.';
      case 'verification':
        return `${completedData.email ?? '입력한 이메일'}으로 인증번호를 전송했습니다.`;
      case 'password':
        return '비밀번호를 지정해주세요.';
      case 'username':
        return '이름을 입력해주세요. (변경 가능)';
    }
  };

  return (
    <StyledContainer>
      <StyledCard>
        <StyledFormWrapper>
          <StyledContentWrapper>
            <StyledHeaderWrapper>
              {currentStep !== 'email' && (
                <StyledBackButton onClick={handleBack}>
                  <Icon name="arrow_left_alt" color={tokens.colors.neutral[400]} size="24px" />
                </StyledBackButton>
              )}
              <StyledTitleSection>
                <Text variant="H2" color={tokens.colors.primary[500]}>
                  {getStepTitle()}
                </Text>
                <Text variant="B1">{getStepDescription()}</Text>
              </StyledTitleSection>
            </StyledHeaderWrapper>

            {currentStep === 'email' && (
              <EmailStep onGoogleSignUp={handleGoogleSignUp} onSignIn={handleSignIn} />
            )}
            {currentStep === 'verification' && <VerificationStep />}
            {currentStep === 'password' && <PasswordStep />}
            {currentStep === 'username' && <UsernameStep />}
          </StyledContentWrapper>
        </StyledFormWrapper>
      </StyledCard>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${tokens.colors.background};
`;

const StyledCard = styled.div`
  width: 720px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  align-items: center;
  box-shadow: ${tokens.shadow[0]};
`;

const StyledFormWrapper = styled.div`
  margin-top: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 400px;
`;

const StyledHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  width: 400px;
`;

const StyledTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const StyledBackButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  align-self: flex-start;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: 4px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;
