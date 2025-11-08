import styled from '@emotion/styled';
import { colors, spacing } from '../tokens';

type DividerOrientation = 'horizontal' | 'vertical';

type DividerProps = {
  orientation?: DividerOrientation;
  spacing?: keyof typeof spacing;
  color?: string;
  thickness?: number;
  className?: string;
};

const StyledDivider = styled.hr<{
  $orientation: DividerOrientation;
  $spacing?: keyof typeof spacing;
  $color?: string;
  $thickness: number;
}>`
  border: none;
  background-color: ${({ $color }) => $color || colors.gray[300]};
  margin: 0;
  
  ${({ $orientation, $spacing: spacingKey, $thickness }) =>
    $orientation === 'horizontal'
      ? `
        width: 100%;
        height: ${$thickness}px;
        margin-top: ${spacingKey ? spacing[spacingKey] : 0};
        margin-bottom: ${spacingKey ? spacing[spacingKey] : 0};
      `
      : `
        width: ${$thickness}px;
        height: 100%;
        margin-left: ${spacingKey ? spacing[spacingKey] : 0};
        margin-right: ${spacingKey ? spacing[spacingKey] : 0};
      `}
`;

export const Divider = ({
  orientation = 'horizontal',
  spacing: spacingProp,
  color,
  thickness = 1,
  className,
}: DividerProps) => {
  return (
    <StyledDivider
      $orientation={orientation}
      $spacing={spacingProp}
      $color={color}
      $thickness={thickness}
      className={className}
    />
  );
};
