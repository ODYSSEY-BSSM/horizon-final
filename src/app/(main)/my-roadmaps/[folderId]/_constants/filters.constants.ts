import type { FilterType } from '../_types';

export interface FilterOption {
  id: FilterType;
  label: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: '전체' },
  { id: 'my', label: '내 로드맵' },
  { id: 'team', label: '팀 로드맵' },
  { id: 'completed', label: '학습 완료' },
  { id: 'in-progress', label: '학습 진행중' },
];
