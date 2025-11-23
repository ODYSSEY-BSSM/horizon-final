import type { RoadmapColor } from '@/shared/types/roadmap';

export const ROADMAP_COLORS = {
  red: {
    bg: '#FEE2E2',
    icon: '#DC2626',
    gradient: 'linear-gradient(180deg, #FCA5A5 0%, #DC2626 100%)',
  },
  orange: {
    bg: '#FFEDD5',
    icon: '#EA580C',
    gradient: 'linear-gradient(180deg, #FDBA74 0%, #EA580C 100%)',
  },
  yellow: {
    bg: '#FEF3C7',
    icon: '#CA8A04',
    gradient: 'linear-gradient(180deg, #FDE047 0%, #EAB308 100%)',
  },
  green: {
    bg: '#D1FAE5',
    icon: '#059669',
    gradient: 'linear-gradient(180deg, #6EE7B7 0%, #10B981 100%)',
  },
  blue: {
    bg: '#DBEAFE',
    icon: '#2563EB',
    gradient: 'linear-gradient(180deg, #93C5FD 0%, #3B82F6 100%)',
  },
  purple: {
    bg: '#E9D5FF',
    icon: '#9333EA',
    gradient: 'linear-gradient(180deg, #D8B4FE 0%, #A855F7 100%)',
  },
} as const satisfies Record<RoadmapColor, { bg: string; icon: string; gradient: string }>;

export const ROADMAP_COLOR_OPTIONS: Array<{ label: string; value: RoadmapColor }> = [
  { label: 'Red', value: 'red' },
  { label: 'Orange', value: 'orange' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Purple', value: 'purple' },
];
