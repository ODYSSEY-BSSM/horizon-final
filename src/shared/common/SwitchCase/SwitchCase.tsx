import type { ReactNode } from 'react';

type PrimitiveKey = string | number | symbol;

type SwitchCaseProps<Value extends PrimitiveKey> = {
  value?: Value | null;
  cases: Partial<Record<Value, ReactNode>>;
  fallback?: ReactNode;
};

const SwitchCase = <Value extends PrimitiveKey>({
  value,
  cases,
  fallback = null,
}: SwitchCaseProps<Value>) => {
  if (value === null || value === undefined) {
    return <>{fallback}</>;
  }

  const matchedCase = cases[value];

  if (matchedCase !== undefined) {
    return <>{matchedCase}</>;
  }

  return <>{fallback}</>;
};

export default SwitchCase;
