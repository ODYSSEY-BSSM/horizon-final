import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';
import type { VerificationStepProps } from '@/core/types';
import SecondaryAction from '../_components/SecondaryAction';
import VerificationInput from '../_components/VerificationInput';

const VerificationStep = ({
  verificationCode,
  setVerificationCode,
  onSubmit,
  onResendCode,
  isLoading,
  errors,
}: VerificationStepProps) => {
  const handleResend = async () => {
    if (onResendCode) {
      await onResendCode();
    }
  };

  return (
    <StyledContainer>
      <VerificationInput
        value={verificationCode}
        onChange={setVerificationCode}
        error={errors.code}
      />

      <StyledButtonSection>
        <StyledSubmitButton
          onClick={onSubmit}
          disabled={verificationCode.length !== 6 || !!errors.code || isLoading}
        >
          <Text variant="ST" color={tokens.colors.white}>
            {isLoading ? '인증 중...' : '확인'}
          </Text>
        </StyledSubmitButton>

        <SecondaryAction
          primaryText="인증번호를 받지 못했나요?"
          actionText="다시 보내기"
          onActionClick={handleResend}
          showTimer={true}
          timerDuration={30}
        />
      </StyledButtonSection>
    </StyledContainer>
  );
};

export default VerificationStep;

const StyledSubmitButton = styled.button<{ disabled: boolean }>`
  width: 400px;
  height: 48px;
  background-color: ${({ disabled }) => (disabled ? tokens.colors.neutral[300] : tokens.colors.primary[500])};
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;
  align-self: center;

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

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

const StyledButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;
