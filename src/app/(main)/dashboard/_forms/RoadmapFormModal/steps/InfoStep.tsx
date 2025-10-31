'use client';

import styled from '@emotion/styled';
import { Controller } from 'react-hook-form';
import Button from '@/components/common/Button/Button';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/shared/tokens';
import { useInfoStepForm } from '../../_hooks/useRoadmapForm';

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

const InfoStep = () => {
  const {
    control,
    onNext,
    onPrevious,
    formState: { errors, isValid },
  } = useInfoStepForm();

  return (
    <StyledFormContainer>
      <StyledFieldContainer>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="이름"
              placeholder="이름을 입력해주세요"
              aria-label="로드맵 이름"
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="설명"
              placeholder="설명을 입력해주세요"
              aria-label="로드맵 설명"
              error={errors.description?.message}
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
