# (main) Route Group Issue Report

> 분석 일자: 2025-11-26
> 분석 범위: `src/app/(main)/**`

---

## 1. 아키텍처 위반 (Import Pattern Violations)

### 1.1 Feature 내부 경로 직접 Import

CLAUDE.md에 명시된 규칙:
> "Always import from feature's `index.ts`, never from internal paths"

**위반 사례:**

| 파일 | 위반 Import |
|------|-------------|
| `dashboard/content.tsx:14` | `from '@/feature/roadmap/stores/roadmapFormStore'` |
| `my-roadmaps/content.tsx:5` | `from '@/feature/folder/hooks/useFolderQueries'` |
| `my-roadmaps/[folderId]/content.tsx:8` | `from '@/feature/roadmap/hooks/useRoadmapQueries'` |
| `my-roadmaps/[folderId]/content.tsx:9` | `from '@/feature/roadmap/utils/typeConverters'` |
| `team-space/content.tsx:7` | `from '@/feature/team/hooks/useTeamQueries'` |
| `team-space/content.tsx:8` | `from '@/feature/team/utils/inviteCode'` |
| `team-space/[teamId]/content.tsx:6` | `from '@/feature/folder/hooks/useFolderQueries'` |
| `team-space/[teamId]/content.tsx:7` | `from '@/feature/folder/types'` |
| `team-space/[teamId]/content.tsx:16` | `from '@/feature/team/hooks/useTeamQueries'` |
| `team-space/[teamId]/content.tsx:17` | `from '@/feature/team/types/team'` |
| `team-space/[teamId]/content.tsx:18` | `from '@/feature/team/utils/inviteCode'` |
| `team-space/[teamId]/[folderId]/content.tsx:8` | `from '@/feature/roadmap/hooks/useRoadmapQueries'` |
| `team-space/[teamId]/[folderId]/content.tsx:9` | `from '@/feature/roadmap/utils/typeConverters'` |
| `team-space/[teamId]/[folderId]/content.tsx:11` | `from '@/feature/team/hooks/useTeamQueries'` |

**영향:**
- Feature 모듈의 캡슐화 위반
- 내부 구현 변경 시 다수의 app 파일 수정 필요
- 의존성 추적 어려움

**권장 해결:**
각 feature의 `index.ts`에서 필요한 export 추가 후 public API를 통해 import

---

## 2. 코드 중복 (Code Duplication)

### 2.1 StyledPageContainer 중복 정의

동일하거나 유사한 `StyledPageContainer`가 **13개 파일**에서 중복 정의됨:

| 파일 | padding | gap | 기타 |
|------|---------|-----|------|
| `dashboard/content.tsx` | `0 60px 80px` | xxlarge | - |
| `dashboard/loading.tsx` | `0 60px 80px` | xxlarge | - |
| `my-roadmaps/content.tsx` | `14px 60px 80px` | 40px | - |
| `my-roadmaps/loading.tsx` | `14px 60px 80px` | 40px | - |
| `my-roadmaps/[folderId]/content.tsx` | `16px 60px 80px` | 40px | - |
| `my-roadmaps/[folderId]/loading.tsx` | `16px 60px 80px` | 40px | - |
| `team-space/content.tsx` | `16px 60px 80px` | 40px | height 추가 |
| `team-space/loading.tsx` | xlarge (token) | - | max-width 추가 |
| `team-space/[teamId]/content.tsx` | `16px 60px 80px` | 40px | - |
| `team-space/[teamId]/loading.tsx` | `16px 60px 80px` | 40px | - |
| `team-space/[teamId]/[folderId]/content.tsx` | `16px 60px 80px` | 40px | - |
| `team-space/[teamId]/[folderId]/loading.tsx` | `16px 60px 80px` | 40px | - |
| `school-connect/content.tsx` | `14px 60px 80px` | 40px | height 추가 |
| `school-connect/loading.tsx` | `14px 60px 80px` | 40px | - |

**문제점:**
- padding 값 불일치 (0, 14px, 16px 혼용)
- 디자인 시스템 일관성 부재
- 유지보수 시 다수 파일 수정 필요

**권장 해결:**
`src/shared/layout/PageContainer.tsx` 생성 및 공통화

### 2.2 Loading/Error Message 스타일 중복

`StyledLoadingMessage`, `StyledErrorMessage`가 3개 이상 파일에서 중복 정의:
- `team-space/content.tsx`
- `team-space/[teamId]/content.tsx`
- `team-space/[teamId]/[folderId]/content.tsx`

---

## 3. 누락된 기능 (Missing Features)

### 3.1 roadmap-viewer Route 불완전

| 항목 | 상태 |
|------|------|
| `loading.tsx` | **누락** |
| `error.tsx` | **누락** |
| API 연동 | **하드코딩된 예제 데이터 사용** |

**현재 상태 (`roadmap-viewer/[id]/page.tsx`):**
```typescript
// 예제 데이터 - 실제로는 API에서 가져와야 합니다
const EXAMPLE_NODES = [/* ... 하드코딩된 데이터 */];
const EXAMPLE_EDGES = [/* ... 하드코딩된 데이터 */];
```

**영향:**
- 실제 로드맵 데이터 표시 불가
- 로딩 상태 미표시
- 에러 핸들링 없음

### 3.2 Breadcrumb 동적 데이터 미구현

**위치:** `src/shared/utils/navigation.ts:19-21`

```typescript
// Future: Replace folderId with actual folder name from API
// Requires async breadcrumb fetching or global folder state
return ['My Roadmaps', folderId];
```

폴더 ID 대신 실제 폴더 이름 표시 필요

### 3.3 Team Space Breadcrumb 미구현

**위치:** `src/shared/utils/navigation.ts:25-27`

```typescript
if (path.startsWith('/team-space')) {
  return ['Team Space'];
}
```

팀 이름, 폴더 이름 등 계층 구조 미반영

---

## 4. Error Boundary 이슈

### 4.1 Error 컴포넌트 reset 기능 미활용

Next.js App Router의 `error.tsx`는 `reset` prop을 받아 재시도 기능을 제공해야 함.
현재 모든 `error.tsx` 파일은 `reset`을 받지 않음:

```typescript
// 현재 코드
export default function DashboardError() {
  return <GeneralErrorPage />;
}

// 권장 코드
export default function DashboardError({
  error,
  reset
}: {
  error: Error;
  reset: () => void
}) {
  return <GeneralErrorPage error={error} onRetry={reset} />;
}
```

### 4.2 Error 메시지 비전문적

**위치:** `src/shared/components/ErrorPage/GeneralErrorPage.tsx:14-15`

```typescript
description="누가봐도 에러임. 이상한짓 말고 돌아가세요.
어쩌면 네가 원인일 수 있어."
```

프로덕션 환경에 부적합한 메시지

---

## 5. UX 이슈

### 5.1 Team Space 자동 리다이렉트 시 빈 화면

**위치:** `team-space/content.tsx:105-108`

```typescript
// 팀이 있을 때는 리다이렉트 중이므로 아무것도 렌더링하지 않음
if (hasTeams) {
  return null;
}
```

팀이 있을 경우 `useEffect` 리다이렉트 완료까지 빈 화면 표시.
로딩 스피너 또는 스켈레톤 표시 권장

### 5.2 팀 조인 에러 핸들링 미흡

**위치:** `team-space/content.tsx:83-86`

```typescript
} catch (_error) {
  toast({ description: '유효하지 않은 초대 코드입니다.' });
}
```

모든 에러를 동일한 메시지로 처리. 네트워크 오류, 이미 가입된 팀 등 구분 필요

### 5.3 Modal 상태 관리 비일관성

일부 파일은 useState로 modal 상태 관리, 일부는 Zustand store 사용:
- `dashboard/content.tsx`: `useRoadmapFormStore()` (Zustand)
- `my-roadmaps/content.tsx`: `useState<ModalState>` (Local State)
- `team-space/[teamId]/content.tsx`: `useState` (Local State)

---

## 6. 타입 안전성 이슈

### 6.1 roadmap-viewer 타입 단언

**위치:** `roadmap-viewer/[id]/page.tsx:189`

```typescript
const roadmapId = params.id as string;
```

`params.id`가 `string | string[]`일 수 있음. 유효성 검증 필요

### 6.2 Team Folder 매핑 타입 불안정

**위치:** `team-space/[teamId]/content.tsx:147-167`

```typescript
return teamRootFolder.directories.map((directory: DirectoryResponse) => {
  // roadmapCount 필드 우선 사용, 없으면 roadmaps 배열 길이 사용
  const roadmapCount = directory.roadmapCount ?? directory.roadmaps?.length ?? 0;
  // ...
});
```

API 응답 구조 불명확, optional chaining 과다 사용

---

## 7. 성능 이슈

### 7.1 불필요한 리렌더링 가능성

**위치:** `team-space/[teamId]/content.tsx:58-133`

WebSocket 콜백 함수들이 `useCallback`으로 감싸져 있으나, `refetchRootFolder`가 의존성에 포함되어 있어 매 렌더링마다 새 함수 생성 가능

### 7.2 Loading 컴포넌트 스켈레톤 하드코딩

각 loading.tsx에서 스켈레톤 개수가 하드코딩됨:
```typescript
{Array.from({ length: 6 }).map(...)}
```

실제 데이터 개수와 무관하게 항상 고정된 스켈레톤 표시

---

## 8. 일관성 이슈

### 8.1 Page Container Padding 불일치

| 페이지 | Top Padding |
|--------|-------------|
| Dashboard | 0 |
| My Roadmaps | 14px |
| My Roadmaps Folder | 16px |
| Team Space | 16px |
| School Connect | 14px |

### 8.2 Dynamic Route Export 일관성

모든 page.tsx에 `export const dynamic = 'force-dynamic'` 적용됨.
일부 페이지는 static generation 가능할 수 있음

---

## 9. 권장 개선사항 요약

| 우선순위 | 항목 | 예상 작업량 |
|----------|------|------------|
| **High** | Import 패턴 정리 (feature index.ts 활용) | 2-3h |
| **High** | roadmap-viewer API 연동 | 4-6h |
| **High** | Error 메시지 수정 | 0.5h |
| **Medium** | PageContainer 공통화 | 2h |
| **Medium** | Error boundary reset 활용 | 1h |
| **Medium** | Breadcrumb 동적 데이터 | 3-4h |
| **Low** | Loading/Error 스타일 공통화 | 1h |
| **Low** | Modal 상태 관리 통일 | 2-3h |

---

## 10. 파일별 이슈 요약

### dashboard/
- [x] `content.tsx`: Import 패턴 위반 (roadmapFormStore)
- [ ] `loading.tsx`: OK
- [ ] `error.tsx`: reset 미활용
- [ ] `page.tsx`: OK

### my-roadmaps/
- [x] `content.tsx`: Import 패턴 위반 (useFolderQueries)
- [x] `[folderId]/content.tsx`: Import 패턴 위반 2건

### roadmap-viewer/
- [x] `[id]/page.tsx`: 하드코딩된 예제 데이터, loading.tsx/error.tsx 누락

### team-space/
- [x] `content.tsx`: Import 패턴 위반 2건, 빈 화면 렌더링 이슈
- [x] `[teamId]/content.tsx`: Import 패턴 위반 4건
- [x] `[teamId]/[folderId]/content.tsx`: Import 패턴 위반 3건

### school-connect/
- [ ] OK (Import 패턴 준수)

---

*이 문서는 코드 분석을 통해 자동 생성되었습니다.*
