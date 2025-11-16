import type { FilterTab } from '@/feature/roadmap';

export const FOLDER_FILTER_TABS: FilterTab[] = [
  {
    value: 'all',
    label: '전체',
  },
  {
    value: 'completed',
    label: '학습 완료',
  },
  {
    value: 'inProgress',
    label: '학습 진행중',
  },
];
