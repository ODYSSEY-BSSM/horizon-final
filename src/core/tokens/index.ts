import { colors } from './color/color';
import { gradients } from './gradient/gradient';
import { icons } from './icon/icon';
import { radius } from './radius/radius';
import { shadow } from './shadow/shadow';
import { spacing } from './spacing/spacing';
import { typos } from './typo/typo';

export const tokens = {
  colors,
  gradients,
  typos,
  icons,
  shadow,
  radius,
  spacing,
} as const;
