import { colors } from '@/shared/tokens/color/color';

const makeGradient = (colorScale: { 100: string; 200: string }) => ({
  horizontal: `linear-gradient(to right, ${colorScale[200]} 0%, ${colorScale[100]} 100%)`,
  vertical: `linear-gradient(to top, ${colorScale[200]} 0%, ${colorScale[100]} 100%)`,
});

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
