import styled from '@emotion/styled';
import { typography } from '@/shared/ui/tokens';

type IconSize = 'XS' | 'SM' | 'MD' | 'LG' | 'XL';

type IconProps = {
  name: string;
  size?: IconSize;
  fill?: boolean;
  color?: string;
  className?: string;
  onClick?: () => void;
};

const getIconSize = (size: IconSize, fill: boolean) => {
  const sizeMap = fill ? typography.icon.fill : typography.icon.stroke;
  return sizeMap[size.toLowerCase() as 'xs' | 'sm' | 'md' | 'lg' | 'xl'];
};

const StyledIcon = styled.span<{
  $size: IconSize;
  $fill: boolean;
  $color?: string;
}>`
  font-family: ${typography.fontFamily.icon.join(', ')};
  font-size: ${({ $size, $fill }) => getIconSize($size, $fill)};
  color: ${({ $color }) => $color || 'inherit'};
  font-weight: ${({ $fill }) => ($fill ? 400 : 300)};
  font-variation-settings: ${({ $fill }) =>
    $fill
      ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
      : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'inherit')};
`;

const Icon = ({ name, size = 'MD', fill = false, color, className, onClick }: IconProps) => {
  return (
    <StyledIcon $size={size} $fill={fill} $color={color} className={className} onClick={onClick}>
      {name}
    </StyledIcon>
  );
};

export default Icon;
