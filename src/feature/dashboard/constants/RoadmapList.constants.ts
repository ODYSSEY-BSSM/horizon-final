import type { FilterType } from '@/feature/dashboard/types/dashboard';

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

export const ITEMS_PER_PAGE = 5;
export const ITEMS_PER_PAGE_THUMBNAIL = 16;
