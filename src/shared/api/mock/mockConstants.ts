
export const MOCK_DELAYS = {
  FAST: 100,
  NORMAL: 200,
  SLOW: 300,
} as const;

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
