import type { FilterType } from '@/lib/types/dashboard';

export const FILTER_OPTIONS: Record<FilterType, string> = {
  all: '전체',
  my: '내 로드맵',
  team: '팀 로드맵',
  completed: '완료',
  'in-progress': '진행중',
};
