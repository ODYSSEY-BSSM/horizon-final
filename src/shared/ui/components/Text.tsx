import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import { typography } from '../tokens';

type TextVariant = 'h1' | 'h2' | 'h3' | 'subtitle' | 'b1' | 'b2' | 'caption' | 'overline';

type TextProps = {
  variant?: TextVariant;
  children: ReactNode;
  color?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

const getTextStyle = (variant: TextVariant) => {
  switch (variant) {
    case 'h1':
      return typography.textStyles.header.h1;
    case 'h2':
      return typography.textStyles.header.h2;
    case 'h3':
      return typography.textStyles.header.h3;
    case 'subtitle':
      return typography.textStyles.subtitle.st;
    case 'b1':
      return typography.textStyles.body.b1;
    case 'b2':
      return typography.textStyles.body.b2;
    case 'caption':
      return typography.textStyles.caption.c;
    case 'overline':
      return typography.textStyles.overline.o;
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

export const Text = ({ variant = 'b1', children, color, className, as }: TextProps) => {
  return (
    <StyledText as={as} $variant={variant} $color={color} className={className}>
      {children}
    </StyledText>
  );
};
