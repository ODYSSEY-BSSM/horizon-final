import type { Color, Icon } from '@/shared/api/types';
import type { ColorOption } from '../components/ColorDropdown/ColorDropdown';
import type { IconOption } from '../components/IconDropdown/IconDropdown';

/**
 * ColorOption (lowercase) → Color (uppercase enum)
 */
export const toRoadmapColor = (color: ColorOption): Color => {
  return color.toUpperCase() as Color;
};

/**
 * IconOption (lowercase) → Icon (uppercase enum)
 */
export const toRoadmapIcon = (icon: IconOption): Icon => {
  return icon.toUpperCase() as Icon;
};
