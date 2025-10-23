import type React from 'react';
import type { AllowedHTMLElement, StyledTextProps, TextProps, TextVariant } from './Text.types';

const defaultElement: Record<TextVariant, AllowedHTMLElement> = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  ST: 'h4',
  B1: 'p',
  B2: 'p',
  C: 'span',
  O: 'span',
};

export const useText = (
  props: TextProps,
): {
  element: AllowedHTMLElement;
  styledProps: StyledTextProps;
  children: React.ReactNode;
  restProps: Omit<
    TextProps,
    'variant' | 'color' | 'width' | 'textAlign' | 'whiteSpace' | 'ellipsis' | 'as' | 'children'
  >;
} => {
  const {
    variant = 'B1',
    as,
    color = 'inherit',
    width = 'auto',
    textAlign = 'left',
    whiteSpace = 'normal',
    ellipsis = false,
    children,
    ...restProps
  } = props;

  const element = as || defaultElement[variant];

  const styledProps = {
    variant,
    color,
    width,
    textAlign,
    whiteSpace,
    ellipsis,
  };

  return {
    element,
    styledProps,
    children,
    restProps,
  };
};
