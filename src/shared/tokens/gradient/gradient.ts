import { colors } from '@/shared/tokens/color/color';

type ColorScale = { 100: string; 200: string };

const makeGradient = (colorScale: ColorScale): string => {
  const darkColor = colorScale[200];
  const lightColor = colorScale[100];

  return `linear-gradient(to top right, ${darkColor} 0%, ${lightColor} 100%)`;
};

export const gradients = {
  roadmap: {
    red: makeGradient(colors.roadmap.red),
    orange: makeGradient(colors.roadmap.orange),
    yellow: makeGradient(colors.roadmap.yellow),
    green: makeGradient(colors.roadmap.green),
    blue: makeGradient(colors.roadmap.blue),
    purple: makeGradient(colors.roadmap.purple),
  },
} as const;
