import type { FilterTab } from '@/feature/roadmap';

export const ROADMAP_FILTER_TABS: FilterTab[] = [
  { value: 'all', label: '전체' },
  { value: 'my-roadmaps', label: '내 로드맵' },
  { value: 'team-roadmaps', label: '팀 로드맵' },
  { value: 'completed', label: '학습 완료' },
  { value: 'in-progress', label: '학습 진행중' },
];
