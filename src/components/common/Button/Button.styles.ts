import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { colors } from '@/core/tokens/color/color';
import { icons } from '@/core/tokens/icon/icon';
import { radius } from '@/core/tokens/radius/radius';
import { typos } from '@/core/tokens/typo/typo';
import {
  BLOCKED_PROPS,
  BUTTON_ICON_CONFIGS,
  BUTTON_TEXT_CONFIGS,
  buttonStyles,
  GAP_SIZES,
  HORIZONTAL_PADDINGS,
  ICON_PADDINGS,
  VERTICAL_PADDING,
} from './Button.constants';
import type { ButtonSize, ButtonVariant, IconPosition, StyledButtonProps } from './Button.types';

const makeTextStyle = (
  fontSize: keyof typeof typos.fontSize,
  fontWeight: keyof typeof typos.fontWeight,
  lineHeight: keyof typeof typos.lineHeight,
) => css`
  font-size: ${typos.fontSize[fontSize]};
  font-weight: ${typos.fontWeight[fontWeight]};
  line-height: ${typos.lineHeight[lineHeight]};
  letter-spacing: 0;
`;

export const getTextStyles = (size: ButtonSize) => {
  const config = BUTTON_TEXT_CONFIGS[size];
  return makeTextStyle(config.fontSize, config.fontWeight, config.lineHeight);
};

const makeIconStyle = (
  filled: keyof typeof icons.fill,
  fontSize: string,
  fontWeight: keyof typeof typos.fontWeight,
  grade: keyof typeof icons.grade,
  opticalSize: keyof typeof icons.opticalSize,
) => css`
  font-size: ${fontSize};
  font-variation-settings: 
    'FILL' ${icons.fill[filled]},
    'wght' ${typos.fontWeight[fontWeight]}, 
    'GRAD' ${icons.grade[grade]}, 
    'opsz' ${icons.opticalSize[opticalSize]};
`;

export const getIconStyles = (size: ButtonSize, filled: keyof typeof icons.fill) => {
  const config = BUTTON_ICON_CONFIGS[size];
  return makeIconStyle(
    filled,
    config.fontSize,
    config.fontWeight,
    config.grade,
    config.opticalSize,
  );
};

export const getGapSize = (size: ButtonSize) => GAP_SIZES[size];

export const getPadding = (size: ButtonSize, iconPosition: IconPosition) => {
  const iconPadding = ICON_PADDINGS[size];
  const horizontal = HORIZONTAL_PADDINGS[size];

  if (iconPosition === 'only') {
    return VERTICAL_PADDING;
  }
  if (iconPosition === 'left') {
    return `${VERTICAL_PADDING} ${horizontal} ${VERTICAL_PADDING} ${iconPadding}`;
  }
  if (iconPosition === 'right') {
    return `${VERTICAL_PADDING} ${iconPadding} ${VERTICAL_PADDING} ${horizontal}`;
  }

  return `${VERTICAL_PADDING} ${horizontal}`;
};

export const getButtonStyle = (variant: ButtonVariant, disabled: boolean) => {
  return buttonStyles[variant][disabled ? 'disabled' : 'default'];
};

const shouldForwardProp = (prop: string): boolean => {
  return !BLOCKED_PROPS.has(prop);
};

const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
  box-sizing: border-box;
  text-decoration: none;
`;

const getFocusStyles = (variant: ButtonVariant) => css`
  &:focus-visible {
    outline: none;
    box-shadow: ${
      variant === 'outlined'
        ? `inset 0 0 0 2px ${colors.primary[500]}, 0 0 0 2px ${colors.primary[200]}`
        : `0 0 0 2px ${colors.primary[200]}`
    };
  }
`;

export const StyledButton = styled('button', { shouldForwardProp })<StyledButtonProps>`
  ${baseButtonStyles}
  
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  gap: ${({ size }) => getGapSize(size)};
  padding: ${({ size, iconPosition }) => getPadding(size, iconPosition)};
  border-radius: ${({ rounded }) => (rounded ? radius.xlarge : radius.medium)};
  
  ${({ variant, disabled }) => getButtonStyle(variant, disabled)}
  ${({ variant }) => getFocusStyles(variant)}
`;

export const StyledButtonIcon = styled.span<{ size: ButtonSize; filled: boolean }>`
  font-family: ${typos.fontFamily.icon.join(', ')};
  user-select: none;
  ${({ size, filled }) => getIconStyles(size, filled ? 1 : 0)}
`;

export const StyledButtonText = styled.span<{ size: ButtonSize }>`
  ${({ size }) => getTextStyles(size)}
`;
