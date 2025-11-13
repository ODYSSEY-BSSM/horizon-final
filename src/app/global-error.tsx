'use client';

import { InternalServerErrorPage } from '@/shared/components/ErrorPage';

/**
 * Global error boundary for 500 Internal Server Errors
 * This catches errors at the root level
 */
export default function GlobalError() {
  return (
    <html lang="ko">
      <body>
        <InternalServerErrorPage />
      </body>
    </html>
  );
}
