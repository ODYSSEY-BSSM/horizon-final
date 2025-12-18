# Horizon 프로젝트 코드베이스 리뷰 보고서

**작성일:** 2025-12-18
**분석 대상:** `/home/user/horizon-final`
**총 파일 수:** 435개 TypeScript/TSX 파일
**총 코드 라인:** ~29,510줄

---

## 목차

1. [Executive Summary](#1-executive-summary)
2. [아키텍처 분석](#2-아키텍처-분석)
3. [코드 품질 문제](#3-코드-품질-문제)
4. [타입 안전성 분석](#4-타입-안전성-분석)
5. [React 패턴 분석](#5-react-패턴-분석)
6. [보안 문제](#6-보안-문제)
7. [성능 문제](#7-성능-문제)
8. [개선 우선순위](#8-개선-우선순위)
9. [상세 파일 목록](#9-상세-파일-목록)

---

## 1. Executive Summary

### 전체 평가: **7.5/10** ⭐

| 영역 | 점수 | 상태 |
|------|------|------|
| 아키텍처 | 7/10 | ⚠️ 개선 필요 |
| 코드 품질 | 6/10 | ⚠️ 개선 필요 |
| 타입 안전성 | 8/10 | ✅ 양호 |
| React 패턴 | 7.5/10 | ✅ 양호 |
| 보안 | 7/10 | ⚠️ 주의 필요 |
| 성능 | 7/10 | ⚠️ 개선 필요 |

### 주요 발견사항 요약

**장점:**
- ✅ 명확한 Feature-based 아키텍처
- ✅ TypeScript strict mode 활성화 및 `any` 사용 없음
- ✅ Zod를 통한 강력한 입력 검증
- ✅ TanStack Query를 통한 효과적인 서버 상태 관리
- ✅ WebSocket cleanup이 잘 구현됨

**주요 문제점:**
- ❌ RoadmapEditor.tsx가 1,432줄로 과도하게 큼
- ❌ Shared 폴더에서 Feature를 의존 (아키텍처 위반 6개 파일)
- ❌ Dropdown 컴포넌트 중복 (880줄, 4개 파일)
- ❌ Refresh 토큰이 헤더에 노출되는 보안 문제
- ❌ 이미지 도메인 제한 없음

---

## 2. 아키텍처 분석

### 2.1 디렉토리 구조

```
src/
├── app/                    # Next.js App Router (49 파일)
│   ├── (auth)/            # 인증 라우트: /signin, /signup
│   ├── (main)/            # 메인 라우트: /dashboard, /my-roadmaps 등
│   └── (studio)/          # 에디터: /editor, /viewer
├── feature/               # Feature 모듈 (276 파일, 63.4%)
│   ├── auth/             # 인증 기능
│   ├── dashboard/        # 대시보드
│   ├── folder/           # 폴더 관리
│   ├── roadmap/          # 로드맵 (핵심 도메인)
│   ├── school/           # 학교 연동
│   └── team/             # 팀 협업
├── shared/               # 공유 리소스 (104 파일, 23.9%)
│   ├── api/              # API 클라이언트
│   ├── components/       # 공유 컴포넌트
│   ├── hooks/            # 공유 훅
│   ├── layout/           # 레이아웃 (Header, Sidebar)
│   ├── tokens/           # 디자인 토큰
│   ├── ui/               # UI 컴포넌트 라이브러리
│   └── utils/            # 유틸리티
└── lib/                  # 라이브러리 (6 파일)
```

### 2.2 아키텍처 규칙 위반 사항

#### 🔴 심각: Shared에서 Feature 의존 (6개 파일)

| 파일 | 위반 내용 |
|------|----------|
| `src/shared/layout/Header/Header.tsx` | `@/feature/auth` 의존 |
| `src/shared/layout/Sidebar/Sidebar.hooks.ts` | `@/feature/dashboard` 의존 |
| `src/shared/layout/Sidebar/Sidebar.types.ts` | `@/feature/dashboard` 의존 |
| `src/shared/layout/Sidebar/Sidebar.constants.ts` | `@/feature/dashboard` 의존 |
| `src/shared/providers/QueryProvider.tsx` | `@/feature/roadmap` 의존 |
| `src/shared/utils/roadmapMapper.ts` | `@/feature/roadmap/types` 의존 |

**예상 의존 방향:**
```
app → feature → shared
    ↘ shared ↙
```

**현재 위반:**
```
shared → feature (❌ 역방향 의존)
```

#### 🟡 중요: Feature 내부 경로 직접 Import (13개 파일)

```typescript
// ❌ 현재 (잘못된 패턴)
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';

// ✅ 권장 패턴
import { useSignupFlow } from '@/feature/auth';
import { useRoadmapFormStore } from '@/feature/roadmap';
```

#### 🟢 누락: index.ts 없는 디렉토리 (5개)

- `/src/feature/auth/store/`
- `/src/feature/auth/validations/`
- `/src/feature/roadmap/stores/`
- `/src/feature/roadmap/editor/api/`
- `/src/shared/utils/`

---

## 3. 코드 품질 문제

### 3.1 중복 코드 - Dropdown 컴포넌트

**4개 파일에서 동일 패턴 반복 (총 880줄, 60-70% 중복)**

| 파일 | 줄 수 |
|------|-------|
| `feature/roadmap/components/IconDropdown/IconDropdown.tsx` | 243 |
| `feature/roadmap/components/ColorDropdown/ColorDropdown.tsx` | 210 |
| `feature/team/components/TeamDropdown/TeamDropdown.tsx` | 227 |
| `feature/roadmap/editor/components/ui/EditorDropdown/EditorDropdown.tsx` | 200 |

**중복 패턴:**
- useDropdown 훅 사용
- useState로 isOpen 관리
- 동일한 스타일 구조
- 동일한 ARIA 속성 설정

**권장 해결책:**
```typescript
// src/shared/ui/Dropdown/GenericDropdown.tsx
export const GenericDropdown = <T extends { value: string; label: string }>({
  options,
  value,
  onChange,
  renderOption,
}) => { /* 공통 로직 */ }
```

### 3.2 거대한 컴포넌트

| 파일 | 줄 수 | 문제점 |
|------|-------|--------|
| `RoadmapEditor.tsx` | **1,432** | useCallback 38개+, useEffect 다수 |
| `RoadmapStyleModal.tsx` | 538 | 스타일 정의 과다 |
| `StyleStep.tsx` | 466 | 중복 Dropdown 코드 |
| `EditorSidebar.tsx` | 429 | 복잡한 조건부 로직 |

### 3.3 하드코딩된 값

**색상 값 중복 정의:**
```typescript
// ColorDropdown.tsx
{ value: 'red', color: '#DC2626' }  // 대문자

// RoadmapFormModal.constants.ts
{ value: 'red', color: '#dc2626' }  // 소문자

// colors.ts
const red = '#CA8A04'  // 다른 값!
```

**반복되는 픽셀 값:**

| 값 | 발견 횟수 |
|----|----------|
| `height: 48px` | 8번 |
| `height: 32px` | 9번 |
| `width: 240px` | 4번 |
| `border-radius: 4px` | 5번 |

### 3.4 TODO/FIXME 주석 (12개)

| 파일 | 내용 |
|------|------|
| `signin/content.tsx:58` | Google OAuth 흐름 구현 필요 |
| `signup/content.tsx:21` | Google OAuth 흐름 구현 필요 |
| `school-connect/content.tsx:24` | Navigate to education detail |
| `RoadmapViewer.tsx:44,48,102` | 노드 추가/제거, 퀴즈 모달 구현 |
| `RoadmapEditor.tsx:208,217,220,235,238` | 커서/섹션/텍스트 렌더링 구현 |
| `EditorSidebar.tsx:89` | API call to convert node |
| `useTeamStep.ts:9` | 백엔드 API 수정 필요 |

### 3.5 Console.log 잔여물 (2개)

- `src/shared/layout/Header/Header.tsx`
- `src/shared/api/websocket.ts`

---

## 4. 타입 안전성 분석

### 4.1 평가 결과: **8.1/10**

| 항목 | 점수 |
|------|------|
| TypeScript strict mode | 9/10 |
| any 사용 제한 | 10/10 (사용 없음!) |
| Type Assertion | 6/10 |
| 제네릭 활용 | 8/10 |
| Union Type Narrowing | 9/10 |
| Zod 동기화 | 8/10 |

### 4.2 문제점

#### 🔴 이중 타입 캐스팅 (위험)

**파일:** `src/shared/ui/Button/Button.tsx`
```typescript
// ❌ 위험한 패턴
const asElement = element as unknown as React.ElementType;

// ✅ 개선
const asElement: React.ElementType = element as React.ElementType;
```

#### 🟡 unknown 배열 타입 미정의

**파일:** `src/shared/api/types.ts`
```typescript
export interface TeamDirectoryMessage {
  roadmaps: unknown[];  // ⚠️ 구체적 타입 필요
}

export interface RoadmapNodeMessage {
  childNode: unknown[];  // ⚠️ 구체적 타입 필요
}
```

#### 🟡 JSON.parse 런타임 검증 누락

**파일:** `src/shared/api/stompWebSocket.ts`
```typescript
const data = JSON.parse(message.body) as T;  // ⚠️ 런타임 검증 없음
```

### 4.3 좋은 패턴 (참고용)

**타입 가드 구현:**
```typescript
// src/feature/roadmap/types/roadmapApi.ts
export function isTeamRoadmap(roadmap: AnyRoadmapResponse): roadmap is TeamRoadmapResponse {
  return 'teamId' in roadmap && 'teamName' in roadmap;
}
```

**Zod 스키마 동기화:**
```typescript
// src/feature/auth/validations/signup.ts
export const passwordSchema = z.object({ /* ... */ });
export type PasswordFormData = z.infer<typeof passwordSchema>;  // ✅ 단일 진실 공급원
```

---

## 5. React 패턴 분석

### 5.1 평가 결과: **7.5/10**

| 항목 | 점수 |
|------|------|
| 컴포넌트 크기/책임 분리 | 5/10 |
| Props Drilling | 6/10 |
| useEffect 의존성 | 8/10 |
| useMemo/useCallback | 7/10 |
| 커스텀 훅 | 8/10 |
| TanStack Query | 9/10 |

### 5.2 컴포넌트 크기 문제

**RoadmapEditor.tsx (1,432줄) 분해 필요:**

현재:
```typescript
export const RoadmapEditor = ({ roadmapId }) => {
  // 데이터 페칭, 상태 관리, WebSocket, 이벤트 핸들러, 렌더링 모두 한 곳에
};
```

권장:
```typescript
// hooks/useEditorData.ts
const useEditorData = (roadmapId) => { /* 데이터 로직 */ };

// hooks/useEditorWebSocket.ts
const useEditorWebSocket = (roadmapId) => { /* WebSocket 로직 */ };

// components/EditorCanvas.tsx
const EditorCanvas = ({ nodes, edges }) => { /* UI만 */ };

// components/EditorToolbar.tsx
const EditorToolbar = ({ onUndo, onRedo }) => { /* 툴바 UI */ };
```

### 5.3 Props Drilling 문제

**RoadmapList.tsx: 16개 props**
```typescript
type RoadmapListProps = {
  items, viewMode, onViewModeChange, filterTabs, activeFilter,
  onFilterChange, showFilterTabs, currentPage, totalPages,
  onPageChange, showPagination, onAddRoadmap, onRoadmapClick,
  title, showHeader, emptyMessage, className
};
```

**권장:** Context API 또는 Zustand store로 상태 이동

### 5.4 잘 구현된 커스텀 훅

| 훅 | 재사용성 |
|----|----------|
| `useStompWebSocket` | ⭐⭐⭐⭐⭐ |
| `useDropdown` | ⭐⭐⭐⭐⭐ |
| `useToast` | ⭐⭐⭐⭐⭐ |
| `useRoadmapList` | ⭐⭐⭐⭐ |

### 5.5 TanStack Query 패턴 (우수)

```typescript
// 효과적인 Query Key 전략
export const roadmapKeys = {
  all: ['roadmaps'] as const,
  lists: () => [...roadmapKeys.all, 'list'] as const,
  detail: (id: number) => [...roadmapKeys.details(), id] as const,
};

// 자동 캐시 무효화
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
};
```

---

## 6. 보안 문제

### 6.1 평가 결과: **7/10**

| 항목 | 상태 | 심각도 |
|------|------|--------|
| XSS (dangerouslySetInnerHTML) | ✅ 허용됨 | 낮음 |
| 민감정보 노출 | ✅ 양호 | 낮음 |
| Refresh 토큰 관리 | ⚠️ 문제 | **중간** |
| 이미지 도메인 | ⚠️ 문제 | **중간** |
| 입력 검증 | ✅ Zod 사용 | 낮음 |
| CSP 설정 | ⚠️ unsafe-inline | 낮음 |

### 6.2 🔴 Refresh 토큰 헤더 노출

**파일:** `src/shared/api/client.ts:166-171`
```typescript
const response = await fetch(`${this.baseURL}/auth/token`, {
  method: 'PUT',
  headers: {
    'Refresh-Token': refreshToken,  // ⚠️ 로그/프록시에 노출 가능
  },
});
```

**권장:** HTTP-only 쿠키로 관리

### 6.3 🔴 이미지 도메인 무제한 허용

**파일:** `next.config.ts:17-28`
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**' },  // ⚠️ 모든 도메인 허용
    { protocol: 'http', hostname: '**' },
  ],
}
```

**권장:** 화이트리스트 방식으로 변경
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.example.com' },
    { protocol: 'https', hostname: 'img.example.com' },
  ],
}
```

### 6.4 긍정적 보안 설정

**토큰 저장 (양호):**
```typescript
// src/shared/api/tokenStore.ts
private readonly cookieOptions = {
  expires: 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,  // ✅ CSRF 방지
};
```

**CSP 헤더 (양호):**
```typescript
// next.config.ts
'X-Frame-Options': 'DENY',
'X-Content-Type-Options': 'nosniff',
'Referrer-Policy': 'strict-origin-when-cross-origin',
```

---

## 7. 성능 문제

### 7.1 평가 결과: **7/10**

| 항목 | 상태 |
|------|------|
| useCallback/useMemo 활용 | 35% (77/220 파일) |
| 메모리 누수 (cleanup) | ✅ 양호 |
| N+1 쿼리 | ⚠️ 주의 필요 |
| 번들 크기 | ⚠️ 모니터링 필요 |

### 7.2 메모이제이션 누락

**파일:** `feature/dashboard/components/RoadmapCard/RoadmapCard.tsx`
```typescript
// ❌ 매번 새로 생성되는 핸들러
const handleEdit = () => { /* ... */ };
const handleDelete = () => { /* ... */ };

const dropdownItems: DropdownMenuItem[] = [
  { onClick: handleEdit },  // 참조 변경 → 리렌더링
];

// ✅ 개선
const handleEdit = useCallback(() => { /* ... */ }, [dependencies]);
const dropdownItems = useMemo(() => [...], [handleEdit, handleDelete]);
```

### 7.3 N+1 쿼리 패턴

**파일:** `feature/roadmap/hooks/useRoadmapQueries.ts`
```typescript
// ⚠️ 팀 수만큼 API 호출
const roadmapsPromises = teamIds.map((teamId) =>
  roadmapApi.getTeamRoadmaps(teamId)  // N개의 요청
);
await Promise.all(roadmapsPromises);
```

**권장:** 배치 API 또는 동시 요청 수 제한

### 7.4 큰 번들 영향 라이브러리

| 라이브러리 | 용도 | 영향 |
|-----------|------|------|
| `reactflow` | 그래프 에디터 | 큼 |
| `@emotion/*` | CSS-in-JS | 런타임 오버헤드 |
| `@tanstack/react-query` | 상태 관리 | 중간 |

**권장:** 동적 임포트 및 코드 스플리팅 적용

---

## 8. 개선 우선순위

### Phase 1: 긴급 (1주)

| 작업 | 예상 시간 | 영향도 |
|------|----------|--------|
| console.log 제거 (2개 파일) | 0.5시간 | 높음 |
| Refresh 토큰 HTTP-only 쿠키로 변경 | 2시간 | 높음 |
| 이미지 도메인 화이트리스트 설정 | 1시간 | 높음 |
| 색상 상수 중앙화 | 2시간 | 중간 |

### Phase 2: 중요 (2-3주)

| 작업 | 예상 시간 | 영향도 |
|------|----------|--------|
| Shared → Feature 의존성 제거 (6개 파일) | 4시간 | 높음 |
| Generic Dropdown 컴포넌트 개발 | 4시간 | 높음 |
| RoadmapEditor.tsx 분리 | 8시간 | 높음 |
| Feature 내부 경로 import 수정 (13개 파일) | 2시간 | 중간 |
| 누락된 index.ts 추가 (5개) | 1시간 | 낮음 |

### Phase 3: 개선 (3-4주)

| 작업 | 예상 시간 | 영향도 |
|------|----------|--------|
| TODO 항목 구현/이슈화 (12개) | 16시간 | 중간 |
| Props drilling 해결 (RoadmapList) | 4시간 | 중간 |
| 메모이제이션 최적화 | 4시간 | 중간 |
| unknown 배열 타입 구체화 | 2시간 | 낮음 |
| JSON.parse 런타임 검증 추가 | 2시간 | 낮음 |

---

## 9. 상세 파일 목록

### 9.1 수정 필요 파일 (아키텍처 위반)

```
src/shared/layout/Header/Header.tsx
src/shared/layout/Sidebar/Sidebar.hooks.ts
src/shared/layout/Sidebar/Sidebar.types.ts
src/shared/layout/Sidebar/Sidebar.constants.ts
src/shared/providers/QueryProvider.tsx
src/shared/utils/roadmapMapper.ts
```

### 9.2 수정 필요 파일 (내부 경로 import)

```
src/feature/auth/components/TokenInitializer/TokenInitializer.tsx
src/feature/school/hooks/useSchoolConnect.ts
src/feature/dashboard/hooks/*.ts (4개)
src/feature/dashboard/forms/RoadmapFormModal/** (3개)
src/feature/dashboard/components/RoadmapCard/RoadmapCard.tsx
src/feature/roadmap/hooks/useRoadmapSubmit.ts
src/feature/roadmap/components/RoadmapListItem/RoadmapListItem.tsx
src/app/(main)/dashboard/content.tsx
src/app/(studio)/viewer/[roadmapId]/content.tsx
```

### 9.3 리팩토링 대상 (큰 파일)

```
src/feature/roadmap/editor/RoadmapEditor.tsx (1,432줄)
src/feature/roadmap/forms/RoadmapStyleModal/RoadmapStyleModal.tsx (538줄)
src/feature/dashboard/forms/RoadmapFormModal/steps/StyleStep.tsx (466줄)
src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx (429줄)
```

### 9.4 중복 제거 대상 (Dropdown)

```
src/feature/roadmap/components/IconDropdown/IconDropdown.tsx
src/feature/roadmap/components/ColorDropdown/ColorDropdown.tsx
src/feature/team/components/TeamDropdown/TeamDropdown.tsx
src/feature/roadmap/editor/components/ui/EditorDropdown/EditorDropdown.tsx
```

---

## 결론

Horizon 프로젝트는 전반적으로 **잘 구조화된 코드베이스**입니다. Feature-based 아키텍처를 따르고 있으며, TypeScript strict mode와 Zod를 통한 타입 안전성이 우수합니다.

**가장 시급한 개선 사항:**
1. 보안: Refresh 토큰 관리 및 이미지 도메인 제한
2. 아키텍처: Shared → Feature 역방향 의존성 제거
3. 코드 품질: RoadmapEditor.tsx 분리 및 Dropdown 중복 제거

이러한 개선을 통해 코드 유지보수성과 확장성이 크게 향상될 것으로 예상됩니다.

---

*이 보고서는 자동화된 코드 분석을 기반으로 작성되었습니다.*
