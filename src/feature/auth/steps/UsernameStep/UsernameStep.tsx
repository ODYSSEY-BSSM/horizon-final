'use client';

import styled from '@emotion/styled';
import { PrimaryButton } from '@/feature/auth';
import { useUsernameForm } from '@/feature/auth/hooks/useUsernameForm';
import { tokens } from '@/shared/tokens';
import { Text, TextField } from '@/shared/ui';

const UsernameStep = () => {
  const {
    register,
    formState: { errors },
    onSubmit,
    isLoading,
  } = useUsernameForm();

  return (
    <StyledForm onSubmit={onSubmit}>
      <TextField
        label="사용자 이름"
        placeholder="UserName"
        type="text"
        width="100%"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message || '16자 이내 한글 또는 영어로 작성'}
      />

      <PrimaryButton type="submit" disabled={isLoading}>
        <Text variant="ST" color={tokens.colors.white}>
          {isLoading ? '완료 중...' : '완료'}
        </Text>
      </PrimaryButton>
    </StyledForm>
  );
};

export default UsernameStep;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 62px;
  width: 100%;
`;
