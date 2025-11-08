import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import { typography } from '../tokens';

type TextVariant =
  | 'H1_H_32'
  | 'H2_EB_24'
  | 'H3_B_20'
  | 'ST_SB_18'
  | 'B1_R_16'
  | 'B2_R_14'
  | 'C_M_12'
  | 'O_M_11'
  | 'BTN_SML_13'
  | 'BTN_MED_14'
  | 'BTN_LRG_16';

type TextProps = {
  variant?: TextVariant;
  children: ReactNode;
  color?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

const getTextStyle = (variant: TextVariant) => {
  switch (variant) {
    case 'H1_H_32':
      return typography.textStyles.header.h1;
    case 'H2_EB_24':
      return typography.textStyles.header.h2;
    case 'H3_B_20':
      return typography.textStyles.header.h3;
    case 'ST_SB_18':
      return typography.textStyles.subtitle.st;
    case 'B1_R_16':
      return typography.textStyles.body.b1;
    case 'B2_R_14':
      return typography.textStyles.body.b2;
    case 'C_M_12':
      return typography.textStyles.caption.c;
    case 'O_M_11':
      return typography.textStyles.overline.o;
    case 'BTN_SML_13':
      return typography.textStyles.button.sml;
    case 'BTN_MED_14':
      return typography.textStyles.button.med;
    case 'BTN_LRG_16':
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

export const Text = ({ variant = 'B1_R_16', children, color, className, as }: TextProps) => {
  return (
    <StyledText as={as} $variant={variant} $color={color} className={className}>
      {children}
    </StyledText>
  );
};
