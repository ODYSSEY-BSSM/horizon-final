'use client';

import { ErrorPage } from './ErrorPage';

/**
 * 500 에러 페이지
 * 피그마 디자인: Layout/Error Pages/500
 */
export const InternalServerErrorPage = () => {
  return (
    <ErrorPage
      icon="close"
      title="500: Internal Server Error"
      description="페이지가 현재 유지/보수 중이거나,
페이지에 프로그래밍 오류가 있는 것 같습니다."
      buttonText="돌아가기"
    />
  );
};
