'use client';

import { ErrorPage } from './ErrorPage';

/**
 * 404 에러 페이지
 * 피그마 디자인: Layout/Error Pages/404
 */
export const NotFoundPage = () => {
  return (
    <ErrorPage
      icon="close"
      title="404: Not Found"
      description="존재하지 않는 주소를 입력했거나,
요청하신 페이지의 주소가 수정/삭제되어 찾을 수 없습니다."
      buttonText="돌아가기"
    />
  );
};
