import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { colors } from '@/core/tokens/color/color';
import { typos } from '@/core/tokens/typo/typo';
import { BLOCKED_PROPS, baseAffixStyles, baseButtonStyles } from './TextField.constants';

export interface StyledInputWrapperProps {
  width?: string | number;
}

export interface StyledInputProps {
  hasError: boolean;
  filled: boolean;
  hasLeft: boolean;
  hasRight: boolean;
  hasToggle: boolean;
}

export const shouldForwardProp = (prop: string): boolean => {
  return !BLOCKED_PROPS.has(prop);
};

export const StyledAffixLeft = styled.div`
  ${baseAffixStyles}
  left: 12px;
  pointer-events: none;
`;

export const StyledAffixRight = styled.div`
  ${baseAffixStyles}
  right: 12px;
  pointer-events: none;
`;

export const StyledAffixRightButton = styled.button`
  ${baseAffixStyles}
  ${baseButtonStyles}
  right: 12px;

  &:hover {
    background-color: ${colors.neutral[100]};
  }

  &:focus {
    outline: none;
    background-color: ${colors.neutral[200]};
  }
`;

const baseInputStyles = `
  display: flex;
  height: 48px;
  width: 100%;
  align-items: center;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: ${colors.white};
  padding: 12px;
  font-size: ${typos.fontSize[16]};
  font-weight: ${typos.fontWeight.regular};
  line-height: ${typos.lineHeight[24]};
  font-family: ${typos.fontFamily.suit.join(', ')};
  color: ${colors.black};
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
`;

const getInputPadding = (hasLeft: boolean, hasRight: boolean) => {
  if (hasLeft && hasRight) {
    return 'padding-left: 36px; padding-right: 36px;';
  }
  if (hasLeft) {
    return 'padding-left: 36px;';
  }
  if (hasRight) {
    return 'padding-right: 36px;';
  }
  return '';
};

const getInputBoxShadow = (hasError: boolean, filled: boolean) => {
  if (hasError) {
    return `box-shadow: inset 0 0 0 1px ${colors.error[200]};`;
  }
  if (filled) {
    return `box-shadow: inset 0 0 0 1px ${colors.primary[500]};`;
  }
  return `box-shadow: inset 0 0 0 1px ${colors.neutral[300]};`;
};

export const StyledHelper = styled.output`
  text-align: left;
`;

export const StyledTextField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledInputWrapper = styled.div<StyledInputWrapperProps>`
  position: relative;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : (width ?? '100%'))};
`;

export const StyledInput = styled('input', { shouldForwardProp })<StyledInputProps>`
  ${baseInputStyles}

  &::placeholder {
    color: ${colors.neutral[400]};
    font-size: ${typos.fontSize[16]};
    font-weight: ${typos.fontWeight.regular};
    line-height: ${typos.lineHeight[24]};
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 calc(1px * 2) ${colors.primary[500]};
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ hasLeft, hasRight }) => getInputPadding(hasLeft, hasRight)}
  ${({ hasError, filled }) => getInputBoxShadow(hasError, filled)}

  ${({ filled, hasError }) =>
    !hasError &&
    filled &&
    css`
      &:focus {
        box-shadow: inset 0 0 0 calc(1px * 2) ${colors.primary[500]};
      }
    `}
`;
