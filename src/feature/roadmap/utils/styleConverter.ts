import { Color, Icon } from '@/shared/api/types';

/**
 * Converts a lowercase color option to the Color enum value
 * @param color - The color string in lowercase (e.g., 'red', 'blue')
 * @returns The Color enum value (e.g., Color.RED, Color.BLUE)
 */
export const toColorEnum = (color: string): Color => {
  const upperColor = color.toUpperCase();

  // Validate that the color exists in the Color enum
  if (Object.values(Color).includes(upperColor as Color)) {
    return upperColor as Color;
  }

  // Default to BLUE if invalid
  console.warn(`Invalid color "${color}", defaulting to BLUE`);
  return Color.BLUE;
};

/**
 * Converts a lowercase icon option to the Icon enum value
 * @param icon - The icon string in lowercase (e.g., 'database', 'html')
 * @returns The Icon enum value (e.g., Icon.DATABASE, Icon.HTML)
 */
export const toIconEnum = (icon: string): Icon => {
  const upperIcon = icon.toUpperCase();

  // Validate that the icon exists in the Icon enum
  if (Object.values(Icon).includes(upperIcon as Icon)) {
    return upperIcon as Icon;
  }

  // Default to FOLDER if invalid
  console.warn(`Invalid icon "${icon}", defaulting to FOLDER`);
  return Icon.FOLDER;
};
