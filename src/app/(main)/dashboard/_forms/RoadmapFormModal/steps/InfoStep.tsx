'use client';

import styled from '@emotion/styled';
import { Controller } from 'react-hook-form';
import { useInfoStep } from '@/app/(main)/dashboard/_hooks/useInfoStep';
import TextField from '@/components/common/TextField/TextField';
import FormFooter from '../_components/FormFooter';
import { MODAL_SPACING } from '../_constants/spacing';

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
              label="이름"
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
              label="설명"
            />
          )}
        />
      </StyledFieldContainer>

      <FormFooter
        onPrevious={onPrevious}
        onNext={onNext}
        isValid={isValid}
        showPrevious={true}
        isLastStep={false}
      />
    </StyledFormContainer>
  );
};

export default InfoStep;

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${MODAL_SPACING.steps.info.fieldGap};
  padding: ${MODAL_SPACING.modal.padding};
  flex: 1;
`;
