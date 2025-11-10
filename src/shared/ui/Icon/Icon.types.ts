import type React from 'react';

export type IconVariant = 'XS' | 'SM' | 'MD' | 'LG' | 'XL';

export type AllowedHTMLElement = 'span' | 'i' | 'div' | 'button' | 'label';

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  variant?: IconVariant;
  filled?: boolean;
  size?: number | string;
  color?: string;
  as?: AllowedHTMLElement;
  decorative?: boolean;
}

export interface StyledIconProps {
  variant: IconVariant;
  filled: boolean;
  size?: number | string;
  color?: string;
}
