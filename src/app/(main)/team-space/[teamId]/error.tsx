'use client';

import { GeneralErrorPage } from '@/shared/components/ErrorPage';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TeamSpaceError({ reset }: ErrorProps) {
  return <GeneralErrorPage onRetry={reset} />;
}
