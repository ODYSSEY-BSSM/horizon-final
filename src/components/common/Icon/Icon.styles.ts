import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { icons } from '@/core/tokens/icon/icon';
import { typos } from '@/core/tokens/typo/typo';
import { BLOCKED_PROPS, ICON_VARIANTS } from './Icon.constants';
import type { IconVariant } from './Icon.types';

const makeIconStyle = (
  fontSize: string,
  fontWeight: keyof typeof typos.fontWeight,
  opticalSize: keyof typeof icons.opticalSize,
  filled = false,
) => css`
  font-size: ${fontSize};
  font-variation-settings: 
    'FILL' ${filled ? 1 : icons.fill[0]},
    'wght' ${typos.fontWeight[fontWeight]},
    'GRAD' ${icons.grade[0]},
    'opsz' ${icons.opticalSize[opticalSize]};
`;

export const getIconStyle = (variant: IconVariant, filled = false) => {
  const config = ICON_VARIANTS[variant];
  return makeIconStyle(config.fontSize, config.fontWeight, config.opticalSize, filled);
};

export const shouldForwardProp = (prop: string): boolean => {
  return !BLOCKED_PROPS.has(prop);
};

const baseIconStyles = css`
  font-family: ${typos.fontFamily.icon.join(', ')};
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const StyledIcon = styled('span', { shouldForwardProp })<{
  variant: IconVariant;
  filled: boolean;
  size?: number | string;
  color?: string;
}>`
  ${baseIconStyles}

  ${({ color }) => color && `color: ${color};`}
  
  ${({ variant, filled }) => {
    const config = ICON_VARIANTS[variant];
    return css`
      ${getIconStyle(variant, filled)}
      font-variation-settings: 
        'FILL' ${filled ? icons.fill[1] : icons.fill[0]},
        'wght' ${typos.fontWeight[config.fontWeight]},
        'GRAD' ${icons.grade[0]},
        'opsz' ${icons.opticalSize[config.opticalSize]};
    `;
  }}

  ${({ size }) =>
    size != null ? { fontSize: typeof size === 'number' ? `${size}px` : size } : undefined}
`;
