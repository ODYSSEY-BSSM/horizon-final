const fontFamily = {
  suit: ['SUIT Variable', 'sans-serif'],
  icon: ['Material Symbols Rounded', 'monospace'],
} as const;

const fontWeight = {
  heavy: 900,
  extrabold: 800,
  bold: 700,
  semibold: 600,
  medium: 500,
  regular: 400,
  light: 300,
  extralight: 200,
} as const;

const fontSize = {
  40: '40px',
  32: '32px',
  24: '24px',
  20: '20px',
  18: '18px',
  16: '16px',
  14: '14px',
  13: '13px',
  12: '12px',
  11: '11px',
} as const;

const lineHeight = {
  44: '44px',
  34: '34px',
  28: '28px',
  26: '26px',
  24: '24px',
  22: '22px',
  20: '20px',
  18: '18px',
  16: '16px',
  14: '14px',
} as const;

const letterSpacing = {
  5: '0.05em',
  1: '0.01em',
  0: '0em',
  '-1': '-0.01em',
  '-1.5': '-0.015em',
  '-2': '-0.02em',
} as const;

export const typos = {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight
} as const;