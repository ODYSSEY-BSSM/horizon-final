'use client';

import { InternalServerErrorPage } from '@/shared/components/ErrorPage';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for 500 Internal Server Errors
 * This catches errors at the root level
 */
export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body>
        <InternalServerErrorPage onRetry={reset} />
      </body>
    </html>
  );
}
