import type { FilterType, RoadmapColor } from '@/lib/types/dashboard';

interface FilterConfig {
  id: FilterType;
  label: string;
}

export const FILTERS: FilterConfig[] = [
  { id: 'all', label: '전체' },
  { id: 'my', label: '내 로드맵' },
  { id: 'team', label: '팀 로드맵' },
  { id: 'completed', label: '학습 완료' },
  { id: 'in-progress', label: '학습 진행중' },
];

interface ColorConfig {
  background: string;
  icon: string;
}

export const ROADMAP_COLORS: Record<RoadmapColor, ColorConfig> = {
  red: {
    background: '#fee2e2',
    icon: '#dc2626',
  },
  orange: {
    background: '#ffedd5',
    icon: '#ea580c',
  },
  yellow: {
    background: '#fef9c3',
    icon: '#ca8a04',
  },
  green: {
    background: '#dcfce7',
    icon: '#16a34a',
  },
  blue: {
    background: '#dbeafe',
    icon: '#2563eb',
  },
  purple: {
    background: '#f3e8ff',
    icon: '#9333ea',
  },
};

export const ITEMS_PER_PAGE = 5;
export const ITEMS_PER_PAGE_THUMBNAIL = 16;
