import type React from 'react';
import type { CSSProperties } from 'react';

export type TextVariant = 'H1' | 'H2' | 'H3' | 'ST' | 'B1' | 'B2' | 'C' | 'O';

export type AllowedHTMLElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'button';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  children: React.ReactNode;
  color?: string;
  width?: string;
  textAlign?: CSSProperties['textAlign'];
  whiteSpace?: CSSProperties['whiteSpace'];
  ellipsis?: boolean;
  as?: AllowedHTMLElement;
  htmlFor?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface StyledTextProps {
  variant: TextVariant;
  color: string;
  width: string;
  textAlign: CSSProperties['textAlign'];
  whiteSpace: CSSProperties['whiteSpace'];
  ellipsis: boolean;
}
