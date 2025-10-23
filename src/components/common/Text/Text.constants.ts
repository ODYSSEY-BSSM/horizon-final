export const TEXT_VARIANTS = {
  H1: {
    fontSize: 32 as const,
    fontWeight: 'heavy' as const,
    lineHeight: 44 as const,
    letterSpacing: '-2' as const,
  },
  H2: {
    fontSize: 24 as const,
    fontWeight: 'extrabold' as const,
    lineHeight: 34 as const,
    letterSpacing: '-1.5' as const,
  },
  H3: {
    fontSize: 20 as const,
    fontWeight: 'bold' as const,
    lineHeight: 28 as const,
    letterSpacing: '-1' as const,
  },
  ST: {
    fontSize: 18 as const,
    fontWeight: 'semibold' as const,
    lineHeight: 26 as const,
    letterSpacing: 0 as const,
  },
  B1: {
    fontSize: 16 as const,
    fontWeight: 'regular' as const,
    lineHeight: 24 as const,
    letterSpacing: 0 as const,
  },
  B2: {
    fontSize: 14 as const,
    fontWeight: 'regular' as const,
    lineHeight: 22 as const,
    letterSpacing: 0 as const,
  },
  C: {
    fontSize: 12 as const,
    fontWeight: 'light' as const,
    lineHeight: 18 as const,
    letterSpacing: 1 as const,
  },
  O: {
    fontSize: 11 as const,
    fontWeight: 'medium' as const,
    lineHeight: 16 as const,
    letterSpacing: 5 as const,
  },
} as const;

export const BLOCKED_PROPS = new Set([
  'variant',
  'color',
  'width',
  'textAlign',
  'whiteSpace',
  'ellipsis',
]);
