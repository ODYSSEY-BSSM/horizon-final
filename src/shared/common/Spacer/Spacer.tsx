import styled from '@emotion/styled';
import type { CSSProperties, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { spacing } from '@/shared/ui/tokens';

type SpacingKey = keyof typeof spacing;

type SpacerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: SpacingKey | string;
  axis?: 'horizontal' | 'vertical';
  flex?: boolean;
};

const spacingRecord = spacing as Record<string, string>;

const resolveSpacingValue = (value?: SpacingKey | string) => {
  if (value === undefined) {
    return undefined;
  }

  const key = String(value);
  if (spacingRecord[key] !== undefined) {
    return spacingRecord[key];
  }

  return typeof value === 'number' ? `${value}px` : value;
};

const SpacerElement = styled.span<{ $flex: boolean }>`
  display: block;
  flex-shrink: 0;

  ${({ $flex }) =>
    $flex
      ? `
    flex-grow: 1;
    flex-basis: 0;
  `
      : ''}
`;

const Spacer = forwardRef<HTMLSpanElement, SpacerProps>(
  ({ size = 0, axis = 'vertical', flex = false, style, ...rest }, ref) => {
    const resolvedSize = resolveSpacingValue(size) ?? '0';

    const dimensionStyles: CSSProperties =
      axis === 'horizontal'
        ? { width: resolvedSize, height: 'auto' }
        : { height: resolvedSize, width: '100%' };

    const flexStyles: CSSProperties = flex
      ? {
          flexGrow: 1,
          flexBasis: 0,
          width: axis === 'horizontal' ? undefined : '100%',
          height: axis === 'vertical' ? undefined : 'auto',
        }
      : {};

    const mergedStyle = {
      ...dimensionStyles,
      ...flexStyles,
      ...style,
    };

    return <SpacerElement ref={ref} $flex={flex} style={mergedStyle} {...rest} />;
  },
);

Spacer.displayName = 'Spacer';

export default Spacer;
