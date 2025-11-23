import type { FilterTab } from '@/shared/types/filter';

/**
 * 대시보드 필터 탭
 * 용도: 대시보드 페이지에서 로드맵 필터링 (분류 + 상태)
 */
export const DASHBOARD_FILTER_TABS: FilterTab[] = [
  { value: 'all', label: '전체' },
  { value: 'my', label: '내 로드맵' },
  { value: 'team', label: '팀 로드맵' },
  { value: 'completed', label: '완료' },
  { value: 'in-progress', label: '진행중' },
];

/**
 * 폴더 정렬 필터 탭
 * 용도: 폴더 리스트 페이지 (개인 로드맵, 팀 스페이스)
 */
export const FOLDER_SORT_TABS: FilterTab[] = [
  { value: 'latest', label: '최신순' },
  { value: 'progress', label: '진행률순' },
  { value: 'name', label: '이름순' },
];

/**
 * 폴더 내 로드맵 상태 필터 탭
 * 용도: 개인 폴더 상세 페이지
 */
export const FOLDER_STATUS_TABS: FilterTab[] = [
  { value: 'all', label: '전체' },
  { value: 'completed', label: '학습 완료' },
  { value: 'inProgress', label: '학습 진행중' },
];

/**
 * 팀 폴더 로드맵 필터 탭
 * 용도: 팀 폴더 상세 페이지 (분류 + 상태)
 */
export const TEAM_FOLDER_FILTER_TABS: FilterTab[] = [
  { value: 'all', label: '전체' },
  { value: 'my', label: '내 로드맵' },
  { value: 'team', label: '팀 로드맵' },
  { value: 'completed', label: '완료' },
  { value: 'inProgress', label: '진행 중' },
];
