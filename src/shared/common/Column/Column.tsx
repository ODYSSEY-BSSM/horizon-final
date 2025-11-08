import styled from '@emotion/styled';
import type { CSSProperties, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { spacing } from '@/shared/ui/tokens';

type SpacingKey = keyof typeof spacing;

type ColumnProps = HTMLAttributes<HTMLDivElement> & {
  gap?: SpacingKey | string;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
  fullWidth?: boolean;
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

const ColumnContainer = styled.div<{
  $align?: CSSProperties['alignItems'];
  $justify?: CSSProperties['justifyContent'];
  $wrap?: CSSProperties['flexWrap'];
  $fullWidth: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => $align ?? 'stretch'};
  justify-content: ${({ $justify }) => $justify ?? 'flex-start'};
  flex-wrap: ${({ $wrap }) => $wrap ?? 'nowrap'};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ gap, align, justify, wrap, fullWidth = false, style, ...rest }, ref) => {
    const resolvedGap = resolveSpacingValue(gap);
    const mergedStyle = resolvedGap !== undefined ? { gap: resolvedGap, ...style } : style;

    return (
      <ColumnContainer
        ref={ref}
        $align={align}
        $justify={justify}
        $wrap={wrap}
        $fullWidth={fullWidth}
        style={mergedStyle}
        {...rest}
      />
    );
  },
);

Column.displayName = 'Column';

export default Column;
