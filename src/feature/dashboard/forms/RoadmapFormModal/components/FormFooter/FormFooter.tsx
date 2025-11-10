'use client';

import styled from '@emotion/styled';
import { MODAL_SPACING } from '@/feature/dashboard/forms/RoadmapFormModal/constants/spacing';
import { Button } from '@/shared/ui';

interface FormFooterProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  isValid: boolean;
  showPrevious?: boolean;
  isLastStep?: boolean;
}

const FormFooter = ({
  onPrevious,
  onNext,
  onComplete,
  isValid,
  showPrevious = false,
  isLastStep = false,
}: FormFooterProps) => {
  return (
    <StyledFormFooter>
      {showPrevious && onPrevious && (
        <Button size="medium" variant="outlined" onClick={onPrevious} aria-label="이전 단계">
          이전
        </Button>
      )}

      {isLastStep && onComplete ? (
        <Button
          size="medium"
          variant="contained"
          onClick={onComplete}
          disabled={!isValid}
          aria-label="로드맵 생성 완료"
        >
          완료
        </Button>
      ) : (
        <Button
          size="medium"
          variant="contained"
          onClick={onNext}
          disabled={!isValid}
          aria-label="다음 단계"
        >
          다음
        </Button>
      )}
    </StyledFormFooter>
  );
};

export default FormFooter;

const StyledFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${MODAL_SPACING.footer.buttonGap};
  padding: 0 ${MODAL_SPACING.modal.padding} ${MODAL_SPACING.modal.padding};
  margin-top: auto;
`;
