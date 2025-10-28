'use client';

import styled from '@emotion/styled';
import { SwitchCase } from '@toss/react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { flex, spacing } from '@/core/styles';
import { tokens } from '@/core/tokens';
import { useSignUpHandlers } from './_hooks/useSignUpHandlers';
import EmailStep from './_steps/EmailStep';
import PasswordStep from './_steps/PasswordStep';
import UsernameStep from './_steps/UsernameStep';
import VerificationStep from './_steps/VerificationStep';

export default function SignUpContent() {
  const {
    currentStep,
    signUpData,
    isLoading,
    errors,
    setErrors,
    email,
    setEmail,
    verificationCode,
    setVerificationCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    handleEmailSubmit,
    handleVerificationSubmit,
    handlePasswordSubmit,
    handleUsernameSubmit,
    handleGoogleSignUp,
    handleSignIn,
    handleBack,
    handleResendVerificationCode,
  } = useSignUpHandlers();

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
        return `${signUpData.email}으로 인증번호를 전송했습니다.`;
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

            <SwitchCase
              value={currentStep}
              caseBy={{
                email: (
                  <EmailStep
                    email={email}
                    setEmail={(value: string) => {
                      setEmail(value);
                      if (errors.email) {
                        setErrors((prev: Record<string, string>) => ({ ...prev, email: '' }));
                      }
                    }}
                    onSubmit={handleEmailSubmit}
                    isLoading={isLoading}
                    errors={errors}
                    onGoogleSignUp={handleGoogleSignUp}
                    onSignIn={handleSignIn}
                  />
                ),
                verification: (
                  <VerificationStep
                    verificationCode={verificationCode}
                    setVerificationCode={(value: string) => {
                      setVerificationCode(value);
                      if (errors.code) {
                        setErrors((prev: Record<string, string>) => ({ ...prev, code: '' }));
                      }
                    }}
                    onSubmit={handleVerificationSubmit}
                    onResendCode={handleResendVerificationCode}
                    isLoading={isLoading}
                    errors={errors}
                    email={signUpData.email}
                  />
                ),
                password: (
                  <PasswordStep
                    password={password}
                    setPassword={(value: string) => {
                      setPassword(value);
                      if (errors.password) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          password: '',
                        }));
                      }
                    }}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={(value: string) => {
                      setConfirmPassword(value);
                      if (errors.confirmPassword) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          confirmPassword: '',
                        }));
                      }
                    }}
                    onSubmit={handlePasswordSubmit}
                    isLoading={isLoading}
                    errors={errors}
                  />
                ),
                username: (
                  <UsernameStep
                    username={username}
                    setUsername={(value: string) => {
                      setUsername(value);
                      if (errors.username) {
                        setErrors((prev: Record<string, string>) => ({
                          ...prev,
                          username: '',
                        }));
                      }
                    }}
                    onSubmit={handleUsernameSubmit}
                    isLoading={isLoading}
                    errors={errors}
                  />
                ),
              }}
            />
          </StyledContentWrapper>
        </StyledFormWrapper>
      </StyledCard>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  ${flex.columnCenter}
  width: 100%;
  height: 100vh;
  background-color: ${tokens.colors.background};
`;

const StyledCard = styled.div`
  ${flex.columnCenter}
  width: 720px;
  height: 100vh;
  background-color: ${tokens.colors.white};
  box-shadow: ${tokens.shadow[0]};
`;

const StyledFormWrapper = styled.div`
  ${flex.columnCenter}
  ${spacing.mt(140)}
`;

const StyledContentWrapper = styled.div`
  ${flex.column}
  ${flex.gap(30)}
  width: 400px;
`;

const StyledHeaderWrapper = styled.div`
  ${flex.columnStart}
  ${flex.gap(16)}
  width: 400px;
`;

const StyledTitleSection = styled.div`
  ${flex.columnStart}
  ${flex.gap(8)}
`;

const StyledBackButton = styled.button`
  ${flex.center}
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
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
