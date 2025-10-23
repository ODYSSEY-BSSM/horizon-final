import { colors } from './color/color';
import { gradients } from './gradient/gradient';
import { icons } from './icon/icon';
import { shadow } from './shadow/shadow';
import { typos } from './typo/typo';
import { radius } from './radius/radius';
import { spacing } from './spacing/spacing';

export const tokens = {
  colors,
  gradients,
  typos,
  icons,
  shadow,
  radius,
  spacing,
} as const;