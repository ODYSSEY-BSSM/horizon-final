import styled from '@emotion/styled';
import { typography } from '../tokens';

type IconVariant =
  | 'ICN_SML_16'
  | 'ICN_MED_20'
  | 'ICN_LRG_24'
  | 'ICON_STROKE_XS'
  | 'ICON_STROKE_SM'
  | 'ICON_STROKE_MD'
  | 'ICON_STROKE_LG'
  | 'ICON_STROKE_XL'
  | 'ICON_FILL_XS'
  | 'ICON_FILL_SM'
  | 'ICON_FILL_MD'
  | 'ICON_FILL_LG'
  | 'ICON_FILL_XL';

type IconProps = {
  name: string;
  variant?: IconVariant;
  color?: string;
  className?: string;
  onClick?: () => void;
};

const getIconStyle = (variant: IconVariant) => {
  switch (variant) {
    case 'ICN_SML_16':
      return { size: typography.icon.button.sml, fill: false };
    case 'ICN_MED_20':
      return { size: typography.icon.button.med, fill: false };
    case 'ICN_LRG_24':
      return { size: typography.icon.button.lrg, fill: false };
    case 'ICON_STROKE_XS':
      return { size: typography.icon.stroke.xs, fill: false };
    case 'ICON_STROKE_SM':
      return { size: typography.icon.stroke.sm, fill: false };
    case 'ICON_STROKE_MD':
      return { size: typography.icon.stroke.md, fill: false };
    case 'ICON_STROKE_LG':
      return { size: typography.icon.stroke.lg, fill: false };
    case 'ICON_STROKE_XL':
      return { size: typography.icon.stroke.xl, fill: false };
    case 'ICON_FILL_XS':
      return { size: typography.icon.fill.xs, fill: true };
    case 'ICON_FILL_SM':
      return { size: typography.icon.fill.sm, fill: true };
    case 'ICON_FILL_MD':
      return { size: typography.icon.fill.md, fill: true };
    case 'ICON_FILL_LG':
      return { size: typography.icon.fill.lg, fill: true };
    case 'ICON_FILL_XL':
      return { size: typography.icon.fill.xl, fill: true };
    default:
      return { size: typography.icon.stroke.md, fill: false };
  }
};

const StyledIcon = styled.span<{
  $variant: IconVariant;
  $color?: string;
}>`
  font-family: ${typography.fontFamily.icon.join(', ')};
  font-size: ${({ $variant }) => getIconStyle($variant).size};
  color: ${({ $color }) => $color || 'inherit'};
  font-weight: ${({ $variant }) => (getIconStyle($variant).fill ? 400 : 300)};
  font-variation-settings: ${({ $variant }) =>
    getIconStyle($variant).fill
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
  variant = 'ICON_STROKE_MD',
  color,
  className,
  onClick,
}: IconProps) => {
  return (
    <StyledIcon $variant={variant} $color={color} className={className} onClick={onClick}>
      {name}
    </StyledIcon>
  );
};
