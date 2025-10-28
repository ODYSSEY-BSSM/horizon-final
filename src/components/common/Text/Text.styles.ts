import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { typos } from '@/shared/tokens/typo/typo';
import { BLOCKED_PROPS, TEXT_VARIANTS } from './Text.constants';
import type { StyledTextProps, TextVariant } from './Text.types';

const baseTextStyle = css`
  font-family: ${typos.fontFamily.suit.join(', ')};
`;

const makeTextStyle = (
  fontSize: keyof typeof typos.fontSize,
  fontWeight: keyof typeof typos.fontWeight,
  lineHeight: keyof typeof typos.lineHeight,
  letterSpacing: keyof typeof typos.letterSpacing,
) => css`
  ${baseTextStyle};
  font-size: ${typos.fontSize[fontSize]};
  font-weight: ${typos.fontWeight[fontWeight]};
  line-height: ${typos.lineHeight[lineHeight]};
  letter-spacing: ${typos.letterSpacing[letterSpacing]};
`;

export const getTextStyle = (variant: TextVariant) => {
  const config = TEXT_VARIANTS[variant];
  return makeTextStyle(config.fontSize, config.fontWeight, config.lineHeight, config.letterSpacing);
};

const shouldForwardProp = (prop: string): boolean => {
  return !BLOCKED_PROPS.has(prop);
};

const getEllipsisStyles = (ellipsis: boolean, whiteSpace?: string) => {
  if (ellipsis) {
    return {
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis' as const,
    };
  }
  return { whiteSpace };
};

export const StyledText = styled('div', { shouldForwardProp })<StyledTextProps>`
  ${({ color, textAlign, width }) => ({ color, textAlign, width })}
  
  ${({ whiteSpace, ellipsis }) => getEllipsisStyles(!!ellipsis, whiteSpace)}
  ${({ variant }) => getTextStyle(variant)}
`;
