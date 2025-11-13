import type React from 'react';
import type { ButtonProps } from './Button.types';

export const useButton = <T extends React.ElementType = 'button'>(
  props: ButtonProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>,
) => {
  const {
    as,
    size = 'medium',
    iconPosition = 'none',
    variant = 'contained',
    rounded = false,
    children,
    iconName = 'check',
    iconFilled = false,
    disabled = false,
    type = 'button',
    'aria-label': ariaLabel,
    active = false,
    ...restProps
  } = props;

  const element = as || 'button';
  const isNativeButton = element === 'button';
  const isLink = element === 'a' || 'href' in restProps;

  const styledProps = {
    size,
    variant,
    iconPosition,
    rounded,
    disabled,
    active,
  };

  const ariaProps = {
    'aria-disabled': disabled,
    'aria-label': iconPosition === 'only' ? ariaLabel || iconName : undefined,
  };

  const semantics = isNativeButton
    ? { type }
    : isLink
      ? {}
      : { role: 'button', tabIndex: disabled ? -1 : 0 };

  const finalRestProps = {
    ...semantics,
    ...restProps,
  } as Record<string, unknown>;

  if (disabled && isLink) {
    const a = finalRestProps as Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    a.href = undefined;
    a.target = undefined;
    a.rel = undefined;
    a.download = undefined;
  }

  return {
    element: disabled && isLink ? 'span' : element,
    styledProps,
    ariaProps,
    restProps: finalRestProps as Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>,
    children,
    iconName,
    iconFilled,
  };
};
