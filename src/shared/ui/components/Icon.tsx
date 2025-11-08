import styled from '@emotion/styled';
import { typography } from '../tokens';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconType = 'stroke' | 'fill';

type IconProps = {
  name: string;
  size?: IconSize;
  type?: IconType;
  color?: string;
  className?: string;
  onClick?: () => void;
};

const StyledIcon = styled.span<{
  $size: IconSize;
  $type: IconType;
  $color?: string;
}>`
  font-family: ${typography.fontFamily.icon.join(', ')};
  font-size: ${({ $size, $type }) =>
    $type === 'stroke' ? typography.icon.stroke[$size] : typography.icon.fill[$size]};
  color: ${({ $color }) => $color || 'inherit'};
  font-weight: ${({ $type }) => ($type === 'fill' ? 400 : 300)};
  font-variation-settings: ${({ $type }) =>
    $type === 'fill'
      ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
      : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'inherit')};
`;

export const Icon = ({
  name,
  size = 'md',
  type = 'stroke',
  color,
  className,
  onClick,
}: IconProps) => {
  return (
    <StyledIcon $size={size} $type={type} $color={color} className={className} onClick={onClick}>
      {name}
    </StyledIcon>
  );
};
