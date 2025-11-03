import { css } from '@emotion/react';
import { colors } from '@/shared/tokens/color/color';
import { spacing } from '@/shared/tokens/spacing/spacing';

export const BUTTON_TEXT_CONFIGS = {
  small: { fontSize: 13 as const, fontWeight: 'semibold' as const, lineHeight: 18 as const },
  medium: { fontSize: 14 as const, fontWeight: 'semibold' as const, lineHeight: 20 as const },
  large: { fontSize: 16 as const, fontWeight: 'semibold' as const, lineHeight: 24 as const },
} as const;

export const BUTTON_ICON_CONFIGS = {
  small: {
    fontSize: '16px',
    fontWeight: 'regular' as const,
    grade: 0 as const,
    opticalSize: 20 as const,
  },
  medium: {
    fontSize: '20px',
    fontWeight: 'regular' as const,
    grade: 0 as const,
    opticalSize: 24 as const,
  },
  large: {
    fontSize: '24px',
    fontWeight: 'medium' as const,
    grade: 25 as const,
    opticalSize: 40 as const,
  },
} as const;

export const GAP_SIZES = {
  small: spacing.gap.small, // 6px
  medium: spacing.gap.medium, // 8px
  large: spacing.gap.large, // 10px
} as const;

export const HORIZONTAL_PADDINGS = {
  small: spacing.padding.horizontal.small, // 16px
  medium: spacing.padding.horizontal.medium, // 20px
  large: spacing.padding.horizontal.large, // 24px
} as const;

export const VERTICAL_PADDING = spacing.padding.vertical; // 10px

export const ICON_PADDINGS = {
  small: spacing.padding.icon.small, // 10px
  medium: spacing.padding.icon.medium, // 12px
  large: spacing.padding.icon.large, // 14px
} as const;

export const buttonStyles = {
  contained: {
    default: css`
      background-color: ${colors.primary[500]};
      color: ${colors.white};
      border: none;

      &:hover {
        background-color: ${colors.primary[700]};
      }

      &:active {
        background-color: ${colors.primary[900]};
      }
    `,
    active: css`
      background-color: ${colors.primary[900]};
      color: ${colors.white};
      border: none;
    `,
    disabled: css`
      cursor: not-allowed;
      background-color: ${colors.neutral[300]};
      color: ${colors.neutral[500]};
      border: none;
    `,
  },
  outlined: {
    default: css`
      background-color: transparent;
      border: 1px solid ${colors.primary[500]};
      color: ${colors.primary[500]};

      &:hover {
        background-color: ${colors.primary[600]};
        color: ${colors.white};
      }

      &:active {
        background-color: ${colors.primary[900]};
        color: ${colors.white};
      }
    `,
    active: css`
      background-color: ${colors.primary[900]};
      color: ${colors.white};
      border: 1px solid ${colors.primary[500]};
    `,
    disabled: css`
      cursor: not-allowed;
      background-color: transparent;
      color: ${colors.neutral[300]};
      border: 1px solid ${colors.neutral[300]};
    `,
  },
  text: {
    default: css`
      background-color: transparent;
      border: none;
      color: ${colors.primary[500]};

      &:hover {
        background-color: ${colors.primary[100]};
      }

      &:active {
        background-color: ${colors.primary[100]};
      }
    `,
    active: css`
      background-color: ${colors.primary[100]};
      border: none;
      color: ${colors.primary[500]};
    `,
    disabled: css`
      cursor: not-allowed;
      background-color: transparent;
      color: ${colors.neutral[300]};
      border: none;
    `,
  },
} as const;

export const BLOCKED_PROPS = new Set(['size', 'variant', 'iconPosition', 'rounded']);
