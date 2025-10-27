import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/core/tokens';
import type { UsernameStepProps } from '@/core/types';

const UsernameStep = ({
  username,
  setUsername,
  onSubmit,
  isLoading,
  errors,
}: UsernameStepProps) => {
  return (
    <StyledContainer>
      <TextField
        label="사용자 이름"
        placeholder="UserName"
        type="text"
        width="100%"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!errors.username}
        helperText={errors.username || '16자 이내 한글 또는 영어로 작성'}
      />

      <StyledSubmitButton
        onClick={onSubmit}
        disabled={!username.trim() || !!errors.username || isLoading}
      >
        <Text variant="ST" color={tokens.colors.white}>
          {isLoading ? '완료 중...' : '완료'}
        </Text>
      </StyledSubmitButton>
    </StyledContainer>
  );
};

export default UsernameStep;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 62px;
  width: 100%;
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
