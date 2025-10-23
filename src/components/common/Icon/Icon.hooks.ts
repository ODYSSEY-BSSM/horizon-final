import type { IconProps } from './Icon.types';

export const useIcon = (props: IconProps) => {
  const {
    name,
    variant = 'MD',
    filled = false,
    size,
    color,
    as,
    decorative = true,
    ...restProps
  } = props;

  const ariaProps = decorative
    ? { 'aria-hidden': true }
    : {
        role: 'img',
        'aria-hidden': false,
        'aria-label': ('aria-label' in restProps ? restProps['aria-label'] : undefined) ?? name,
      };

  const styledProps = {
    as,
    variant,
    filled,
    size,
    color,
  };

  return {
    styledProps,
    ariaProps,
    restProps,
    children: name,
  };
};
