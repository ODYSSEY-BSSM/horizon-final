'use client';

import { ErrorPage } from './ErrorPage';

interface GeneralErrorPageProps {
  onRetry?: () => void;
}

/**
 * 일반 에러 페이지
 * 피그마 디자인: Layout/Error Pages/General
 */
export const GeneralErrorPage = ({ onRetry }: GeneralErrorPageProps) => {
  return (
    <ErrorPage
      icon="close"
      title="문제가 발생했습니다."
      description="일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      buttonText={onRetry ? '다시 시도' : '돌아가기'}
      onButtonClick={onRetry}
    />
  );
};
