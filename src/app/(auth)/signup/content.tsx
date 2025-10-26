import styled from '@emotion/styled';
import { SwitchCase } from '@toss/react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/core/tokens';
import { useSignUpHandlers } from './_hooks/useSignUpHandlers';
import EmailStep from './steps/EmailStep';
import PasswordStep from './steps/PasswordStep';
import UsernameStep from './steps/UsernameStep';
import VerificationStep from './steps/VerificationStep';

const SignUpContent = () => {
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
      <StyledContentWrapper>
        <StyledHeaderWrapper>
          {currentStep !== 'email' && (
            <StyledBackButton onClick={handleBack}>
              <Icon name="arrow_left_alt" color={tokens.colors.neutral[400]} size="24px" />
            </StyledBackButton>
          )}
          <StyledTitleSection>
            <Text variant="H2" color={tokens.colors.primary[500]}>{getStepTitle()}</Text>
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
    </StyledContainer>
  );
};

export default SignUpContent;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 140px;
  width: 100%;
  min-height: 100vh;
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
