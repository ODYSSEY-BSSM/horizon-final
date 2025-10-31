'use client';

import styled from '@emotion/styled';
import { Controller } from 'react-hook-form';
import { useInfoStep } from '@/app/(main)/dashboard/_hooks/useInfoStep';
import Button from '@/components/common/Button/Button';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/shared/tokens';

const InfoStep = () => {
  const { control, onNext, onPrevious, isValid } = useInfoStep();

  return (
    <StyledFormContainer>
      <StyledFieldContainer>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              placeholder="이름을 입력해주세요"
              aria-label="로드맵 이름"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              placeholder="설명을 입력해주세요"
              aria-label="로드맵 설명"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </StyledFieldContainer>

      <StyledFormFooter>
        <Button size="medium" variant="outlined" onClick={onPrevious} aria-label="이전 단계">
          이전
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={onNext}
          disabled={!isValid}
          aria-label="다음 단계"
        >
          다음
        </Button>
      </StyledFormFooter>
    </StyledFormContainer>
  );
};

export default InfoStep;

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  padding: ${tokens.spacing.large};
  flex: 1;
`;

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledFormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${tokens.spacing.large};
  border-top: 1px solid ${tokens.colors.neutral[200]};
  margin-top: auto;
`;
