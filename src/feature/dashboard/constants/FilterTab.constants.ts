import type { FilterType } from '@/feature/dashboard/types/dashboard';

export const FILTER_OPTIONS: Record<FilterType, string> = {
  all: '전체',
  my: '내 로드맵',
  team: '팀 로드맵',
  completed: '학습 완료',
  'in-progress': '학습 진행 중',
};
