/**
 * 필터 탭 인터페이스
 * 모든 필터 탭 컴포넌트에서 사용하는 공통 타입
 */
export interface FilterTab {
  value: string;
  label: string;
}

/**
 * 필터 탭 배열 타입
 */
export type FilterTabsConfig = FilterTab[];

/**
 * 필터 탭 컴포넌트 Props
 */
export interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabClick: (value: string) => void;
  className?: string;
}
