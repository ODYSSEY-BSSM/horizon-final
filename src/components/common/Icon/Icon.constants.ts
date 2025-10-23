export const ICON_VARIANTS = {
  XS: { fontSize: '16px', fontWeight: 'light' as const, opticalSize: 20 as const },
  SM: { fontSize: '20px', fontWeight: 'regular' as const, opticalSize: 24 as const },
  MD: { fontSize: '24px', fontWeight: 'regular' as const, opticalSize: 24 as const },
  LG: { fontSize: '32px', fontWeight: 'medium' as const, opticalSize: 40 as const },
  XL: { fontSize: '40px', fontWeight: 'semibold' as const, opticalSize: 48 as const },
} as const;

export const BLOCKED_PROPS = new Set(['variant', 'filled', 'size', 'color']);
