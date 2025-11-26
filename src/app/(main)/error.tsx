'use client';

import { GeneralErrorPage } from '@/shared/components/ErrorPage';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MainError({ reset }: ErrorProps) {
  return <GeneralErrorPage onRetry={reset} />;
}
