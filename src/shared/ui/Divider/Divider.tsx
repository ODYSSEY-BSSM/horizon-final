import { StyledHorizontalDivider, StyledVerticalDivider } from './Divider.styles';
import type { DividerProps } from './Divider.types';

const Divider = ({ orientation = 'horizontal', length = '100%', ...props }: DividerProps) => {
  return orientation === 'vertical' ? (
    <StyledVerticalDivider
      {...props}
      role="separator"
      aria-orientation="vertical"
      length={length}
    />
  ) : (
    <StyledHorizontalDivider {...props} length={length} />
  );
};

Divider.displayName = 'Divider';

export default Divider;
