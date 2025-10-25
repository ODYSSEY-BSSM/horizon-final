import styled from '@emotion/styled';
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <>
            <StyledFormSection direction="column" gap="40px">
              <StyledHeaderSection direction="column" gap="16px">
                <StyledBackButton onClick={handleBack}>
                  <Icon name="arrow_left_alt" color={tokens.colors.neutral[400]} size="24px" />
                </StyledBackButton>
                <StyledTitleSection direction="column" gap="8px" align="start">
                  <StyledTitle>{getStepTitle()}</StyledTitle>
                  <StyledDescription>{getStepDescription()}</StyledDescription>
                </StyledTitleSection>
              </StyledHeaderSection>
              <TextField
                label="이메일"
                placeholder="이메일 입력"
                type="email"
                width="100%"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev: Record<string, string>) => ({ ...prev, email: '' }));
                  }
                }}
                error={!!errors.email}
                helperText={errors.email}
              />
            </StyledFormSection>
            <EmailStep
              email={email}
              onSubmit={handleEmailSubmit}
              isLoading={isLoading}
              errors={errors}
              onGoogleSignUp={handleGoogleSignUp}
              onSignIn={handleSignIn}
            />
          </>
        );

      case 'verification':
        return (
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
        );

      case 'password':
        return (
          <PasswordStep
            password={password}
            setPassword={(value: string) => {
              setPassword(value);
              if (errors.password) {
                setErrors((prev: Record<string, string>) => ({ ...prev, password: '' }));
              }
            }}
            confirmPassword={confirmPassword}
            setConfirmPassword={(value: string) => {
              setConfirmPassword(value);
              if (errors.confirmPassword) {
                setErrors((prev: Record<string, string>) => ({ ...prev, confirmPassword: '' }));
              }
            }}
            onSubmit={handlePasswordSubmit}
            isLoading={isLoading}
            errors={errors}
          />
        );

      case 'username':
        return (
          <UsernameStep
            username={username}
            setUsername={(value: string) => {
              setUsername(value);
              if (errors.username) {
                setErrors((prev: Record<string, string>) => ({ ...prev, username: '' }));
              }
            }}
            onSubmit={handleUsernameSubmit}
            isLoading={isLoading}
            errors={errors}
          />
        );
    }
  };

  return (
    <StyledContainer>
      <StyledMainWrapper>
        <StyledContentWrapper>
          <StyledMainContent
            direction="column"
            gap={
              currentStep === 'email' ? '82px' : currentStep === 'verification' ? '60px' : '30px'
            }
          >
            {currentStep === 'email' ? (
              renderStepContent()
            ) : (
              <>
                <StyledHeaderSection direction="column" gap="16px">
                  <StyledBackButton onClick={handleBack}>
                    <Icon name="arrow_left_alt" color={tokens.colors.neutral[400]} size="24px" />
                  </StyledBackButton>
                  <StyledTitleSection direction="column" gap="8px" align="start">
                    <StyledTitle>{getStepTitle()}</StyledTitle>
                    <StyledDescription>{getStepDescription()}</StyledDescription>
                  </StyledTitleSection>
                </StyledHeaderSection>
                {renderStepContent()}
              </>
            )}
          </StyledMainContent>
        </StyledContentWrapper>
      </StyledMainWrapper>
    </StyledContainer>
  );
};

export default SignUpContent;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: ${tokens.colors.neutral[100]};
  padding: 0;
`;

const StyledMainWrapper = styled.div`
  background-color: ${tokens.colors.white};
  width: 720px;
  min-height: 100vh;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const StyledContentWrapper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
`;

const StyledMainContent = styled.div<{ direction: string; gap: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  gap: ${({ gap }) => gap};
`;

const StyledFormSection = styled.div<{ direction: string; gap: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  gap: ${({ gap }) => gap};
`;

const StyledHeaderSection = styled.div<{ direction: string; gap: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  gap: ${({ gap }) => gap};
`;

const StyledTitleSection = styled.div<{ direction: string; gap: string; align: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  gap: ${({ gap }) => gap};
  align-items: ${({ align }) => align};
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

const StyledTitle = styled(Text)`
  font-size: 24px;
  font-weight: 800;
  line-height: 34px;
  letter-spacing: -0.36px;
  color: ${tokens.colors.primary[500]};
`;

const StyledDescription = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  color: ${tokens.colors.neutral[900]};
`;
