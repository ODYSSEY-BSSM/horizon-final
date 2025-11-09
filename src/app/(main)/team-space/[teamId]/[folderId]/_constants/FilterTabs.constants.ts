import type { FilterTab } from '@/lib/types/team';

export const ROADMAP_FILTER_TABS: FilterTab[] = [
  { label: '전체', value: 'all' },
  { label: '내 로드맵', value: 'my' },
  { label: '팀 로드맵', value: 'team' },
  { label: '완료', value: 'completed' },
  { label: '진행 중', value: 'inProgress' },
];
