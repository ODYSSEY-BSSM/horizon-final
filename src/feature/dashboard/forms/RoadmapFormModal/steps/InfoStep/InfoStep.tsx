'use client';

import styled from '@emotion/styled';
import { FormFooter } from '@/feature/dashboard/forms/RoadmapFormModal/components/FormFooter';
import { MODAL_SPACING } from '@/feature/dashboard/forms/RoadmapFormModal/constants/spacing';
import { useInfoStep } from '@/feature/dashboard/hooks/useInfoStep';
import { TextField } from '@/shared/ui';

const InfoStep = () => {
  const { name, description, categories, updateField, onNext, onPrevious, isValid } = useInfoStep();

  return (
    <StyledFormContainer>
      <StyledFieldContainer>
        <TextField
          value={name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="이름을 입력해주세요"
          aria-label="로드맵 이름"
          label="이름"
        />

        <TextField
          value={description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="설명을 입력해주세요"
          aria-label="로드맵 설명"
          label="설명"
        />
        <TextField
          value={categories.join(',')}
          onChange={(e) => updateField('categories', e.target.value.split(','))}
          placeholder="카테고리를 입력해주세요 (쉼표로 구분)"
          aria-label="로드맵 카테고리"
          label="카테고리"
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
