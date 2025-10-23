import type React from 'react';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'contained' | 'outlined';
export type IconPosition = 'none' | 'left' | 'right' | 'only';

export interface ButtonProps<T extends React.ElementType = 'button'> {
  as?: T;
  size?: ButtonSize;
  iconPosition?: IconPosition;
  variant?: ButtonVariant;
  rounded?: boolean;
  children?: React.ReactNode;
  iconName?: string;
  iconFilled?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  onClick?: (e: React.SyntheticEvent<HTMLElement>) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
}

export interface StyledButtonProps {
  size: ButtonSize;
  variant: ButtonVariant;
  iconPosition: IconPosition;
  rounded: boolean;
  disabled: boolean;
}
