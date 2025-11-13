'use client';

import { ErrorPage } from './ErrorPage';

/**
 * 일반 에러 페이지
 * 피그마 디자인: Layout/Error Pages/General
 */
export const GeneralErrorPage = () => {
  return (
    <ErrorPage
      icon="close"
      title="문제가 발생했습니다."
      description="누가봐도 에러임. 이상한짓 말고 돌아가세요.
어쩌면 네가 원인일 수 있어."
      buttonText="돌아가기"
    />
  );
};
