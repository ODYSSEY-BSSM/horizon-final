import { forwardRef } from 'react';
import { useIcon } from './Icon.hooks';
import { StyledIcon } from './Icon.styles';
import type { IconProps } from './Icon.types';

const Icon = forwardRef<HTMLElement, IconProps>((props, ref) => {
  const { styledProps, ariaProps, restProps, children } = useIcon(props);

  return (
    <StyledIcon ref={ref} {...styledProps} {...ariaProps} {...restProps}>
      {children}
    </StyledIcon>
  );
});

export default Icon;
