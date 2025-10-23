import type React from 'react';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'width'> {
  id?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  width?: string;
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
}
