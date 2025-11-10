import type { RoadmapColor } from '@/shared/types/roadmap';

/**
 * 로드맵 색상 팔레트
 * 각 색상별 배경색과 아이콘 색상 정의
 */
export const ROADMAP_COLORS = {
  red: { bg: '#FEE2E2', icon: '#DC2626' },
  orange: { bg: '#FFEDD5', icon: '#EA580C' },
  yellow: { bg: '#FEF3C7', icon: '#CA8A04' },
  green: { bg: '#D1FAE5', icon: '#059669' },
  blue: { bg: '#DBEAFE', icon: '#2563EB' },
  purple: { bg: '#E9D5FF', icon: '#9333EA' },
} as const satisfies Record<RoadmapColor, { bg: string; icon: string }>;

/**
 * 색상 선택 옵션
 */
export const ROADMAP_COLOR_OPTIONS: Array<{ label: string; value: RoadmapColor }> = [
  { label: 'Red', value: 'red' },
  { label: 'Orange', value: 'orange' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Purple', value: 'purple' },
];
