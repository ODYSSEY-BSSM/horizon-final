/**
 * 로드맵 색상 타입
 */
export type RoadmapColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

/**
 * 로드맵 상태 타입
 */
export type RoadmapStatus = 'not-started' | 'in-progress' | 'completed';

/**
 * 로드맵 카테고리 타입
 */
export type RoadmapCategory = 'personal' | 'team';

/**
 * 뷰 모드 타입
 */
export type ViewType = 'list' | 'thumbnail';

/**
 * 로드맵 아이템 인터페이스
 * UI 표시용 간소화된 로드맵 데이터
 */
export interface RoadmapItem {
  id: string;
  title: string;
  icon: string;
  color: RoadmapColor;
  category: RoadmapCategory;
  steps: number;
  status: RoadmapStatus;
  progress: number;
}
