import type { FilterTab } from '@/lib/types/team';

export const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: '최신순', value: 'recent' },
  { label: '진행률순', value: 'progress' },
  { label: '이름순', value: 'name' },
];
