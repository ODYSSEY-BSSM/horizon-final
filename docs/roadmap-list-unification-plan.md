# 로드맵 리스트 컴포넌트 통합 계획

## 📌 현황 분석

### 현재 로드맵 리스트 구조

| 페이지 | 경로 | 컴포넌트 | 필터 탭 |
|--------|------|----------|---------|
| 대시보드 | `/dashboard` | `RoadmapList` (dashboard) | `FilterTab` - 분류+상태 |
| 개인 로드맵 | `/my-roadmaps` | `FolderList` | `FilterTabs` - 폴더 정렬 |
| 개인 폴더 상세 | `/my-roadmaps/[folderId]` | `FolderRoadmapList` | `FilterTabs` - 상태 필터 |
| 팀 스페이스 | `/team-space/[teamId]` | `FolderGrid` | `FilterTabs` - 폴더 정렬 |
| 팀 폴더 상세 | `/team-space/[teamId]/[folderId]` | `FolderRoadmapList` | `FilterTabs` - 분류+상태 |

### 중복 코드 현황

#### 1. RoadmapList 컴포넌트 (2개)
- `src/feature/dashboard/components/RoadmapList/RoadmapList.tsx`
  - 리스트/썸네일 뷰 전환
  - 필터링 (전체/내/팀/완료/진행중)
  - 페이지네이션
  - RoadmapListItem, RoadmapCard 사용

- `src/feature/roadmap/components/RoadmapList/RoadmapList.tsx`
  - 리스트/썸네일 뷰 전환
  - activeTab, onTabClick props
  - RoadmapListItem 사용

#### 2. FolderRoadmapList 컴포넌트 (재사용 ✅)
- `src/feature/roadmap/components/FolderRoadmapList/FolderRoadmapList.tsx`
  - **이미 개인/팀 폴더 상세에서 공통 사용 중**
  - 리스트/썸네일 뷰 전환
  - FilterTabs props로 받음
  - 페이지네이션
  - 빈 상태 처리

#### 3. FilterTab vs FilterTabs (2개)
- `src/feature/dashboard/components/FilterTab/FilterTab.tsx`
  - 대시보드 전용
  - FILTER_OPTIONS 하드코딩

- `src/feature/roadmap/components/FilterTabs/FilterTabs.tsx`
  - tabs 배열을 props로 받음
  - 재사용 가능한 구조

### 필터 탭 종류

```typescript
// 1. 대시보드 - 분류+상태 필터
FILTER_OPTIONS: {
  all: '전체',
  my: '내 로드맵',
  team: '팀 로드맵',
  completed: '완료',
  'in-progress': '진행중'
}

// 2. 개인 로드맵 폴더 리스트 - 정렬 기준
FILTER_TABS: [
  { value: 'latest', label: '최신순' },
  { value: 'progress', label: '진행률' },
  { value: 'name', label: '이름순' }
]

// 3. 팀 스페이스 폴더 리스트 - 정렬 기준
FOLDER_FILTER_TABS: [
  { value: 'recent', label: '최신순' },
  { value: 'progress', label: '진행률순' },
  { value: 'name', label: '이름순' }
]

// 4. 개인 폴더 상세 - 상태 필터
FOLDER_FILTER_TABS: [
  { value: 'all', label: '전체' },
  { value: 'completed', label: '학습 완료' },
  { value: 'inProgress', label: '학습 진행중' }
]

// 5. 팀 폴더 상세 - 분류+상태 필터
TEAM_FOLDER_ROADMAP_FILTER_TABS: [
  { label: '전체', value: 'all' },
  { label: '내 로드맵', value: 'my' },
  { label: '팀 로드맵', value: 'team' },
  { label: '완료', value: 'completed' },
  { label: '진행 중', value: 'inProgress' }
]
```

## 🎯 통합 목표

### 1. 단일 RoadmapList 컴포넌트
- 모든 로드맵 리스트를 하나의 컴포넌트로 통합
- 재사용 가능한 유연한 구조
- 필터 탭을 props로 받아 페이지별 커스터마이징

### 2. 코드 중복 제거
- 약 1000+ 줄의 중복 코드 제거 예상
- 일관된 UI/UX 제공
- 유지보수 포인트 단일화

### 3. 기능 통일
- 리스트/썸네일 뷰 전환
- 유연한 필터링 시스템
- 페이지네이션
- 빈 상태 처리
- 로드맵 클릭 핸들링

## 📐 설계

### 통합 컴포넌트 구조

```typescript
// src/shared/components/RoadmapList/RoadmapList.tsx

interface RoadmapListProps {
  // 데이터
  items: RoadmapItem[];

  // 뷰 모드
  viewMode?: 'list' | 'thumbnail';
  onViewModeChange?: (mode: 'list' | 'thumbnail') => void;
  showViewToggle?: boolean; // 뷰 전환 버튼 표시 여부

  // 필터 탭
  filterTabs?: FilterTab[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  showFilterTabs?: boolean; // 필터 탭 표시 여부

  // 페이지네이션
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean; // 페이지네이션 표시 여부

  // 액션
  onAddRoadmap?: () => void;
  onRoadmapClick?: (roadmapId: string) => void;

  // 스타일링
  title?: string;
  showHeader?: boolean;
  emptyMessage?: string;
  className?: string;
}
```

### 필터 탭 인터페이스

```typescript
// src/shared/types/filter.ts

export interface FilterTab {
  value: string;
  label: string;
}

export type FilterTabsConfig = FilterTab[];
```

### 필터 상수 정리

```typescript
// src/shared/constants/filterTabs.ts

export const DASHBOARD_FILTER_TABS: FilterTab[] = [
  { value: 'all', label: '전체' },
  { value: 'my', label: '내 로드맵' },
  { value: 'team', label: '팀 로드맵' },
  { value: 'completed', label: '완료' },
  { value: 'in-progress', label: '진행중' },
];

export const FOLDER_SORT_TABS: FilterTab[] = [
  { value: 'latest', label: '최신순' },
  { value: 'progress', label: '진행률순' },
  { value: 'name', label: '이름순' },
];

export const FOLDER_STATUS_TABS: FilterTab[] = [
  { value: 'all', label: '전체' },
  { value: 'completed', label: '학습 완료' },
  { value: 'inProgress', label: '학습 진행중' },
];

export const TEAM_FOLDER_FILTER_TABS: FilterTab[] = [
  { value: 'all', label: '전체' },
  { value: 'my', label: '내 로드맵' },
  { value: 'team', label: '팀 로드맵' },
  { value: 'completed', label: '완료' },
  { value: 'inProgress', label: '진행 중' },
];
```

## 🚀 구현 단계

### Phase 1: 준비 작업
- [ ] 필터 탭 타입 정의 (`src/shared/types/filter.ts`)
- [ ] 필터 탭 상수 통합 (`src/shared/constants/filterTabs.ts`)
- [ ] RoadmapItem 타입 통일 검토

### Phase 2: 통합 컴포넌트 개발
- [ ] `src/shared/components/RoadmapList/RoadmapList.tsx` 생성
- [ ] 기존 FolderRoadmapList 로직 기반으로 확장
- [ ] 옵션 props로 기능 제어 (뷰 토글, 필터 탭, 페이지네이션)
- [ ] Storybook 스토리 작성

### Phase 3: 대시보드 마이그레이션
- [ ] 대시보드 페이지에 통합 컴포넌트 적용
- [ ] DASHBOARD_FILTER_TABS 전달
- [ ] 기존 RoadmapList 제거 (dashboard/components)
- [ ] 테스트 및 검증

### Phase 4: 개인 로드맵 마이그레이션
- [ ] /my-roadmaps 페이지 (폴더 리스트) - 그대로 유지
- [ ] /my-roadmaps/[folderId] 페이지 통합 컴포넌트 적용
- [ ] 기존 FolderRoadmapList 제거 또는 deprecated
- [ ] 테스트 및 검증

### Phase 5: 팀 스페이스 마이그레이션
- [ ] /team-space/[teamId] 페이지 (폴더 리스트) - 그대로 유지
- [ ] /team-space/[teamId]/[folderId] 페이지 통합 컴포넌트 적용
- [ ] 테스트 및 검증

### Phase 6: 정리 및 최적화
- [ ] 사용하지 않는 컴포넌트 제거
  - `src/feature/dashboard/components/RoadmapList/`
  - `src/feature/roadmap/components/RoadmapList/`
  - `src/feature/roadmap/components/FolderRoadmapList/`
  - `src/feature/dashboard/components/FilterTab/`
- [ ] 중복 상수 제거
- [ ] Import 경로 정리
- [ ] 문서 업데이트

## ⚠️ 주의사항

### 1. 점진적 마이그레이션
- 한 번에 모든 페이지를 변경하지 않고 단계적으로 진행
- 각 단계마다 테스트 및 검증

### 2. 기존 기능 유지
- 모든 기존 기능이 동일하게 작동해야 함
- UI/UX 변경 없이 내부 구조만 리팩토링

### 3. 타입 안정성
- TypeScript 엄격한 타입 체크 유지
- Props 인터페이스 명확하게 정의

### 4. 성능 고려
- 불필요한 리렌더링 방지 (useMemo, useCallback)
- 페이지네이션으로 대량 데이터 처리

## 📊 예상 효과

### 코드 감소
- RoadmapList 컴포넌트: 3개 → 1개
- FilterTab 컴포넌트: 2개 → 1개
- 필터 상수 파일: 5개 → 1개
- **총 예상 감소: ~1000+ 줄**

### 유지보수성 향상
- 단일 진실의 원천 (Single Source of Truth)
- 버그 수정 및 기능 추가 시 한 곳만 수정
- 일관된 UI/UX

### 확장성 개선
- 새로운 필터 타입 추가 용이
- 새로운 페이지에서 재사용 가능
- Props를 통한 유연한 커스터마이징

## 🔍 검토 포인트

### 통합 가능성 확인
- ✅ FolderRoadmapList는 이미 개인/팀에서 재사용 중
- ✅ FilterTabs는 이미 tabs를 props로 받는 구조
- ✅ RoadmapListItem, RoadmapCard는 공통 사용 중
- ⚠️ 대시보드 RoadmapList의 특수 기능 확인 필요

### 마이그레이션 위험도
- 🟢 낮음: 폴더 상세 페이지 (이미 공통 컴포넌트 사용)
- 🟡 중간: 대시보드 페이지 (필터 로직 변경 필요)
- 🟢 낮음: 팀 스페이스 폴더 상세 (이미 공통 컴포넌트 사용)

## 📝 참고 사항

### 유지할 것
- `FolderList` - 폴더 카드 그리드 (폴더 리스트 페이지용)
- `FolderGrid` - 팀 폴더 카드 그리드 (팀 스페이스용)
- `RoadmapListItem` - 개별 로드맵 아이템
- `RoadmapCard` - 썸네일 뷰 카드
- `Pagination` - 페이지네이션 컴포넌트

### 제거할 것
- `feature/dashboard/components/RoadmapList`
- `feature/roadmap/components/RoadmapList`
- `feature/roadmap/components/FolderRoadmapList`
- `feature/dashboard/components/FilterTab`
- 중복된 필터 상수 파일들

### 새로 만들 것
- `shared/components/RoadmapList` - 통합 컴포넌트
- `shared/types/filter.ts` - 필터 타입 정의
- `shared/constants/filterTabs.ts` - 필터 상수 통합
