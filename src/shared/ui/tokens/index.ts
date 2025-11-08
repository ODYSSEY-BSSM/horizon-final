import type { BorderRadius } from './borderRadius';
import { borderRadius } from './borderRadius';
import type { Breakpoints, MediaQueries } from './breakpoints';
import { breakpoints, mediaQueries } from './breakpoints';
import type { Colors } from './colors';
import { colors } from './colors';
import type { Shadows } from './shadows';
import { shadows } from './shadows';
import type { Spacing } from './spacing';
import { spacing } from './spacing';
import type { Typography } from './typography';
import { typography } from './typography';
import type { ZIndex } from './zIndex';
import { zIndex } from './zIndex';

export { borderRadius, breakpoints, colors, mediaQueries, shadows, spacing, typography, zIndex };
export type {
  BorderRadius,
  Breakpoints,
  Colors,
  MediaQueries,
  Shadows,
  Spacing,
  Typography,
  ZIndex,
};

export const tokens = {
  borderRadius,
  breakpoints,
  colors,
  mediaQueries,
  shadows,
  spacing,
  typography,
  zIndex,
} as const;

export type Tokens = typeof tokens;
