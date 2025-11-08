import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import { typography } from '../../tokens';

type TextVariant =
  | 'H1'
  | 'H2'
  | 'H3'
  | 'ST'
  | 'B1'
  | 'B2'
  | 'C'
  | 'O'
  | 'BTN_SML'
  | 'BTN_MED'
  | 'BTN_LRG';

type TextProps = {
  variant?: TextVariant;
  children: ReactNode;
  color?: string;
  className?: string;
  as?: string;
};

const getTextStyle = (variant: TextVariant) => {
  switch (variant) {
    case 'H1':
      return typography.textStyles.header.h1;
    case 'H2':
      return typography.textStyles.header.h2;
    case 'H3':
      return typography.textStyles.header.h3;
    case 'ST':
      return typography.textStyles.subtitle.st;
    case 'B1':
      return typography.textStyles.body.b1;
    case 'B2':
      return typography.textStyles.body.b2;
    case 'C':
      return typography.textStyles.caption.c;
    case 'O':
      return typography.textStyles.overline.o;
    case 'BTN_SML':
      return typography.textStyles.button.sml;
    case 'BTN_MED':
      return typography.textStyles.button.med;
    case 'BTN_LRG':
      return typography.textStyles.button.lrg;
    default:
      return typography.textStyles.body.b1;
  }
};

const StyledText = styled.span<{ $variant: TextVariant; $color?: string }>`
  font-family: ${typography.fontFamily.suit.join(', ')};
  font-size: ${({ $variant }) => getTextStyle($variant).fontSize};
  font-weight: ${({ $variant }) => getTextStyle($variant).fontWeight};
  line-height: ${({ $variant }) => getTextStyle($variant).lineHeight};
  letter-spacing: ${({ $variant }) => getTextStyle($variant).letterSpacing};
  color: ${({ $color }) => $color || 'inherit'};
  margin: 0;
  padding: 0;
`;

const Text = ({ variant = 'B1', children, color, className, as }: TextProps) => {
  return (
    <StyledText as={as as any} $variant={variant} $color={color} className={className}>
      {children}
    </StyledText>
  );
};

export default Text;
