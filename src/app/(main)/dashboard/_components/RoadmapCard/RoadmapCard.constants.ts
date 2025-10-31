import type { RoadmapColor } from '@/lib/types/dashboard';

interface GradientConfig {
  start: string;
  end: string;
}

export const ROADMAP_GRADIENTS: Record<RoadmapColor, GradientConfig> = {
  red: {
    start: '#dc2626',
    end: '#fee2e2',
  },
  orange: {
    start: '#ea580c',
    end: '#ffedd5',
  },
  yellow: {
    start: '#e6c200',
    end: '#f9ffa6',
  },
  green: {
    start: '#16a34a',
    end: '#dcfce7',
  },
  blue: {
    start: '#2666dc',
    end: '#dbeafe',
  },
  purple: {
    start: '#a826dc',
    end: '#f3e8ff',
  },
};
