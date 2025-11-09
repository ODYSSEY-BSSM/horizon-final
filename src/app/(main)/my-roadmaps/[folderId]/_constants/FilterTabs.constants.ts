import type { FilterTab } from '../../_components/FilterTabs';

export const FOLDER_FILTER_TABS: FilterTab[] = [
  {
    value: 'all',
    label: '전체',
  },
  {
    value: 'my',
    label: '내 로드맵',
  },
  {
    value: 'team',
    label: '팀 로드맵',
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
