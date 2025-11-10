# 아키텍처 분석 및 개선 계획

> 작성일: 2025-11-10
> 상태: 개선 계획 수립 완료

## 목차

- [개요](#개요)
- [현재 아키텍처](#현재-아키텍처)
- [문제점 분석](#문제점-분석)
- [새로운 아키텍처](#새로운-아키텍처)
- [마이그레이션 계획](#마이그레이션-계획)
- [기대 효과](#기대-효과)

---

## 개요

### 프로젝트 정보

- **프레임워크**: Next.js 15.4.6 (App Router)
- **언어**: TypeScript 5 (strict mode)
- **React 버전**: 19
- **상태 관리**: Zustand + TanStack Query
- **스타일링**: Emotion (CSS-in-JS)
- **린터/포맷터**: Biome

### 분석 결과 요약

| 항목 | 점수 | 상태 |
|------|------|------|
| 프로젝트 구조 | 9/10 | 매우 우수 ✨ |
| 타입 안정성 | 7/10 | 양호 (일부 불일치) |
| 코드 재사용성 | 4/10 | 부족 (중복 많음) ⚠️ |
| 에러 처리 | 3/10 | 미흡 ⚠️ |
| 테스트 커버리지 | 0/10 | 없음 🚨 |
| 스타일링 일관성 | 8/10 | 우수 |
| **전체 평균** | **5.5/10** | **개선 필요** |

---

## 현재 아키텍처

### 디렉토리 구조

```
src/
├── app/                      # Next.js App Router 페이지
│   ├── (auth)/              # 인증 관련 페이지
│   │   ├── signin/
│   │   │   ├── page.tsx
│   │   │   ├── content.tsx
│   │   │   ├── _components/
│   │   │   ├── _hooks/
│   │   │   └── _constants/
│   │   └── signup/
│   └── (main)/              # 메인 애플리케이션
│       ├── dashboard/
│       │   ├── page.tsx
│       │   ├── content.tsx
│       │   ├── _components/
│       │   ├── _hooks/
│       │   └── _constants/
│       ├── my-roadmaps/
│       ├── team-space/
│       └── school-connect/
│
├── components/              # 공통 컴포넌트
│   ├── common/             # Button, Text, Icon, TextField, Divider
│   ├── layout/             # Header, Sidebar
│   └── auth/
│
├── lib/                     # 핵심 라이브러리
│   ├── api/                # API 클라이언트 및 타입
│   ├── auth/               # 인증 관련
│   ├── stores/             # Zustand 상태 관리
│   ├── types/              # 타입 정의
│   └── validations/        # Zod 스키마
│
├── shared/                  # 공유 리소스
│   ├── providers/          # React Context 프로바이더
│   └── tokens/             # 디자인 토큰 시스템
│
└── stories/                 # Storybook 관련
```

### 페이지 구조 패턴

각 페이지는 일관된 구조를 따름:

```
page-name/
├── page.tsx              # Next.js 페이지 엔트리
├── content.tsx           # 실제 페이지 컨텐츠 ('use client')
├── loading.tsx           # 로딩 상태
├── error.tsx             # 에러 상태
├── _components/          # 페이지 전용 컴포넌트
├── _hooks/               # 페이지 전용 훅
├── _constants/           # 페이지 전용 상수
├── _sections/            # 페이지 섹션 컴포넌트
├── _data/                # Mock 데이터
└── _forms/               # 폼 관련 컴포넌트
```

---

## 문제점 분석

### 🚨 심각한 문제

#### 1. 코드 중복 (약 1,000줄 이상)

**Pagination 컴포넌트 - 4곳 중복 (492줄)**
```
src/app/(main)/dashboard/_components/Pagination.tsx
src/app/(main)/my-roadmaps/[folderId]/_components/Pagination.tsx
src/app/(main)/school-connect/_components/Pagination.tsx
src/app/(main)/team-space/[teamId]/[folderId]/_components/Pagination.tsx
```

**useDropdown 훅 - 2곳 중복 (86줄)**
```
src/app/(main)/dashboard/_hooks/useDropdown.ts
src/app/(main)/my-roadmaps/_hooks/useDropdown.ts
```

**RoadmapListItem 컴포넌트 - 3곳 유사 코드 (570줄)**
```
src/app/(main)/dashboard/_components/RoadmapListItem.tsx
src/app/(main)/my-roadmaps/[folderId]/_components/RoadmapListItem.tsx
src/app/(main)/team-space/[teamId]/[folderId]/_components/RoadmapListItem.tsx
```

**ICON_COLORS 상수 - 3곳 중복**
```
src/app/(main)/dashboard/_constants/RoadmapList.constants.ts
src/app/(main)/my-roadmaps/[folderId]/_components/RoadmapListItem.tsx
src/app/(main)/team-space/[teamId]/[folderId]/_components/RoadmapListItem.tsx
```

#### 2. 테스트 부재

- ❌ 테스트 파일 0개
- ❌ `*.test.*`, `*.spec.*` 파일 없음
- ✅ Vitest 설정은 되어있으나 작성 안됨
- **영향**: 리팩토링 시 안전성 보장 불가, 회귀 테스트 불가

#### 3. 아키텍처 문제

**app 디렉토리가 너무 무겁다**
- ❌ 라우팅 + 비즈니스 로직 + 컴포넌트 + 훅 + 상수 모두 포함
- ❌ Next.js의 `app`은 **라우팅만** 담당해야 하는데 너무 많은 책임
- ❌ 페이지 간 코드 공유가 어려움 (그래서 중복 발생)

**기능별 경계가 불명확**
- ❌ "dashboard 기능"과 "roadmap 기능"이 섞여있음
- ❌ 같은 도메인(roadmap)인데 다른 폴더에 흩어짐
- ❌ `dashboard/_components/RoadmapList`와 `my-roadmaps/_components/RoadmapList`가 별개

**lib가 너무 애매함**
- ❌ api, auth, stores, types, validations가 다 섞임
- ❌ "라이브러리"라는 이름이 모호 (뭐가 들어가야 하는지 불명확)

**의존성 방향이 불명확**
- ❌ `app/dashboard`에서 `app/my-roadmaps` 코드를 참조할 수 있나?
- ❌ `lib/api`가 `lib/stores`를 참조해도 되나?
- ❌ 순환 참조 가능성

#### 4. 타입 불일치

```typescript
// dashboard.ts
export interface RoadmapItem {
  id: string;
  title: string;        // ← title
  icon: string;
  color: RoadmapColor;
  category: 'personal' | 'team';
  steps: number;        // ← steps
  status: RoadmapStatus;
  progress: number;
}

// team.ts
export type Roadmap = {
  id: string;
  name: string;         // ← name (불일치!)
  description: string;
  progress?: number;
  totalSteps?: number;  // ← totalSteps (불일치!)
  type?: 'personal' | 'team';
  status?: 'in-progress' | 'completed';
  icon?: string;
  color?: string;
};
```

**문제점**:
- `title` vs `name` 필드 불일치
- `steps` vs `totalSteps` 불일치
- 옵셔널 vs 필수 불일치

### ⚠️ 중요 문제

#### 5. 에러 처리 미흡

```typescript
// 현재 패턴 (client.ts)
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
```

**문제점**:
- try-catch 사용 없음
- 에러 타입별 처리 없음
- 재시도 로직 없음
- 사용자 친화적인 메시지 부족

#### 6. FilterTab 컴포넌트 중복

```
src/app/(main)/dashboard/_components/FilterTab.tsx
src/app/(main)/my-roadmaps/_components/FilterTabs.tsx
src/app/(main)/team-space/_components/FilterTabs.tsx
```

#### 7. 하드코딩된 값들

```typescript
// 토큰 대신 하드코딩
padding: 16px  // ❌ tokens.spacing.medium 사용해야 함

// pathname 기반 하드코딩 (layout.tsx)
const isTeamPage = pathname.startsWith('/team-space');  // ❌
```

---

## 새로운 아키텍처

### 설계 원칙

**Feature-Sliced Design 기반**

1. **명확한 계층 구조**: app → feature → shared
2. **기능별 응집도**: 관련 코드는 한 곳에
3. **단방향 의존성**: 순환 참조 불가능
4. **Public API 패턴**: 명시적 export만 사용

### 새로운 디렉토리 구조

```
src/
  app/                      # ✅ Next.js 라우팅만 (얇게)
    (auth)/
      signin/
        page.tsx            # feature/auth를 import
      signup/
        page.tsx
    (main)/
      dashboard/
        page.tsx            # feature/dashboard를 import
      my-roadmaps/
        [folderId]/
          page.tsx          # feature/roadmap을 import
      team-space/
        [teamId]/
          page.tsx          # feature/team을 import

  feature/                  # ✅ 기능별 모듈 (핵심 비즈니스 로직)
    auth/                   # 인증 기능
      components/           # 로그인 폼, 회원가입 폼 등
        SigninForm/
        SignupForm/
      hooks/                # useAuth, useSignup
      api/                  # login(), signup() API 호출
      types/                # User, SignupForm 타입
      stores/               # authStore (Zustand)
      validations/          # signupSchema (Zod)
      index.ts              # Public API (export)

    dashboard/              # 대시보드 기능
      components/           # GreetingSection, InfoCardsGrid
        GreetingSection/
        InfoCardsGrid/
        DashboardHeader/
      hooks/                # useDashboard
      api/                  # getDashboardData()
      types/                # DashboardData
      index.ts

    roadmap/                # ✅ 로드맵 기능 (통합!)
      components/           # RoadmapList, RoadmapListItem
        RoadmapList/
        RoadmapListItem/    # ✅ 한 곳에만!
        Pagination/         # ✅ 한 곳에만!
        FilterTabs/         # ✅ 한 곳에만!
      hooks/                # useRoadmaps, useDropdown
        useRoadmaps.ts
        useDropdown.ts      # ✅ 한 곳에만!
      api/                  # getRoadmaps(), createRoadmap()
      types/                # Roadmap (통일된 타입)
        roadmap.ts
      constants/            # ROADMAP_COLORS (한 곳에만)
      stores/               # roadmapStore
      index.ts              # Public API

    team/                   # 팀 기능
      components/
      hooks/
      api/
      types/
      index.ts

    school-connect/         # 학교 연결 기능
      components/
      hooks/
      api/
      types/
      index.ts

  shared/                   # ✅ 공유 리소스 (도메인 독립적)
    ui/                     # 공통 UI 컴포넌트
      Button/
        Button.tsx
        Button.styles.ts
        Button.types.ts
        Button.hooks.ts
        Button.constants.ts
      Text/
      Icon/
      TextField/
      Divider/
      ErrorBoundary/

    api/                    # API 클라이언트 (공통)
      client.ts             # apiClient
      errors.ts             # ApiError
      types.ts              # ApiResponse<T>

    hooks/                  # 공통 훅
      useDebounce.ts
      useIntersectionObserver.ts

    types/                  # 공통 타입
      common.ts             # Nullable<T>, ID, etc.

    constants/              # 공통 상수
      routes.ts             # 라우트 경로
      config.ts             # 앱 설정

    tokens/                 # 디자인 토큰 (기존 유지)
      colors.ts
      spacing.ts
      typography.ts
      index.ts

    providers/              # Context Provider
      QueryProvider.tsx
      ThemeProvider.tsx

    lib/                    # 유틸리티 함수
      date.ts
      format.ts
      validation.ts

  stories/                  # Storybook (기존 유지)

  test/                     # ✅ 테스트 유틸리티
    utils/
      setup.ts
      test-utils.tsx        # render with providers
    mocks/
      handlers.ts           # MSW handlers
      data.ts               # Mock data
```

### 의존성 방향

```
app → feature → shared
     ↘ shared ↙
```

**규칙**:
- ✅ `app`은 `feature`와 `shared`만 import
- ✅ `feature`는 다른 `feature`를 import 가능 (명시적으로)
- ✅ `feature`는 `shared`를 import
- ✅ `shared`는 아무것도 import 안함 (완전히 독립적)
- ✅ 순환 참조 불가능

### Public API 패턴

```typescript
// feature/roadmap/index.ts
export { RoadmapList } from './components/RoadmapList';
export { RoadmapListItem } from './components/RoadmapListItem';
export { Pagination } from './components/Pagination';
export { useRoadmaps } from './hooks/useRoadmaps';
export { useDropdown } from './hooks/useDropdown';
export type { Roadmap, RoadmapColor, RoadmapStatus } from './types/roadmap';
export { ROADMAP_COLORS } from './constants/colors';
// 내부 구현은 export 안함 (캡슐화)

// app/dashboard/page.tsx
import { RoadmapList, useRoadmaps } from '@/feature/roadmap';
// ✅ 명시적으로 export된 것만 사용 가능
```

---

## 마이그레이션 계획

상세한 마이그레이션 가이드는 [migration-guide.md](./migration-guide.md) 참조

### 전체 일정 (약 6주)

```
Phase 1: shared 정리 (1주)
  ↓
Phase 2: feature/roadmap 생성 (2주)
  ↓
Phase 3: feature/auth, dashboard, team 생성 (2주)
  ↓
Phase 4: app을 얇게 만들기 (1주)
  ↓
Phase 5: test/ 설정 (1주)
```

### Phase별 요약

#### Phase 1: shared 정리 (1주)

```bash
# 공통 컴포넌트 이동
components/common/* → shared/ui/

# API 클라이언트 이동
lib/api/client.ts → shared/api/client.ts
lib/api/types.ts → shared/api/types.ts

# 공통 훅 생성
shared/hooks/

# 디자인 토큰 유지
shared/tokens/ (기존 유지)
```

#### Phase 2: feature/roadmap 생성 (2주)

**가장 중복이 많은 roadmap 기능부터 통합**

```bash
# 컴포넌트 통합
app/dashboard/_components/Pagination.tsx (4곳) → feature/roadmap/components/Pagination/
app/*/_components/RoadmapListItem.tsx (3곳) → feature/roadmap/components/RoadmapListItem/
app/*/_components/FilterTabs.tsx (3곳) → feature/roadmap/components/FilterTabs/

# 훅 통합
app/dashboard/_hooks/useDropdown.ts (2곳) → feature/roadmap/hooks/useDropdown.ts

# 타입 통합
lib/types/dashboard.ts → feature/roadmap/types/roadmap.ts
lib/types/roadmap.ts → feature/roadmap/types/roadmap.ts
(통일된 하나의 타입으로)

# 상수 통합
ICON_COLORS (3곳) → feature/roadmap/constants/colors.ts

# Public API 생성
feature/roadmap/index.ts
```

#### Phase 3: feature/auth, dashboard, team 생성 (2주)

```bash
# auth 기능
app/(auth)/_components/* → feature/auth/components/
lib/auth/* → feature/auth/
lib/stores/signupFlow.ts → feature/auth/stores/

# dashboard 기능
app/dashboard/_components/* → feature/dashboard/components/
(roadmap 관련 제외)

# team 기능
app/team-space/_components/* → feature/team/components/

# school-connect 기능
app/school-connect/_components/* → feature/school-connect/components/
```

#### Phase 4: app을 얇게 만들기 (1주)

```typescript
// Before
// app/dashboard/content.tsx (복잡한 로직)
export default function DashboardContent() {
  const [filter, setFilter] = useState('all');
  const { data, isLoading } = useQuery(...);

  return (
    <div>
      <GreetingSection />
      <InfoCardsGrid />
      <RoadmapSection filter={filter} onFilterChange={setFilter} />
    </div>
  );
}

// After
// app/dashboard/page.tsx (얇게)
import { DashboardContent } from '@/feature/dashboard';

export default function DashboardPage() {
  return <DashboardContent />;
}

// feature/dashboard/components/DashboardContent.tsx
export function DashboardContent() {
  // 복잡한 로직은 여기로 이동
}
```

#### Phase 5: test/ 설정 (1주)

```bash
# 테스트 유틸리티 생성
test/utils/setup.ts
test/utils/test-utils.tsx  # render with providers

# MSW 설정
test/mocks/handlers.ts
test/mocks/server.ts

# Mock 데이터
test/mocks/data.ts

# 공통 컴포넌트 테스트부터 시작
shared/ui/Button/__tests__/Button.test.tsx
shared/ui/Text/__tests__/Text.test.tsx
```

---

## 기대 효과

### Before & After 비교

| 항목 | 기존 구조 | 새 구조 | 개선율 |
|------|----------|---------|--------|
| **Pagination 중복** | 4곳 (492줄) | 1곳 | -75% ✅ |
| **RoadmapListItem 중복** | 3곳 (570줄) | 1곳 | -66% ✅ |
| **useDropdown 중복** | 2곳 (86줄) | 1곳 | -50% ✅ |
| **Roadmap 타입** | 3개 다른 타입 | 1개 통일 | -66% ✅ |
| **코드 라인 수** | ~15,000줄 | ~13,000줄 | -13% ✅ |
| **의존성 방향** | 불명확 | 명확 | 100% ✅ |
| **기능별 응집도** | 낮음 | 높음 | 100% ✅ |
| **코드 찾기** | 어려움 | 쉬움 | 100% ✅ |
| **팀 협업** | 충돌 가능성 | 독립적 작업 | 100% ✅ |

### 정량적 효과

- **코드 중복 제거**: 약 1,000줄 이상 감소
- **유지보수 시간**: 50% 단축 예상
- **버그 발생률**: 30% 감소 예상 (일관된 타입, 에러 처리)
- **신규 기능 개발 시간**: 40% 단축 예상 (재사용 가능한 컴포넌트)

### 정성적 효과

- ✅ **명확한 코드 위치**: "로드맵 관련 코드는 `feature/roadmap`에"
- ✅ **안전한 리팩토링**: 테스트 커버리지로 회귀 테스트 가능
- ✅ **팀 협업 개선**: 기능별로 독립적 작업 가능, 충돌 최소화
- ✅ **신규 개발자 온보딩**: 명확한 구조로 이해하기 쉬움
- ✅ **코드 리뷰 개선**: 기능 단위로 리뷰 가능
- ✅ **확장성**: 새 기능 추가 시 `feature/new-feature/` 폴더만 생성

---

## 개선 우선순위

### High Priority (즉시 실행 - 1-2주)

1. ✅ Pagination 컴포넌트 공통화
2. ✅ useDropdown 훅 공통화
3. ✅ ROADMAP_COLORS 상수 통합
4. ✅ Roadmap 타입 통합

**효과**: 코드 중복 약 600줄 감소

### Medium Priority (단기 - 1개월)

5. ✅ 공통 컴포넌트 테스트 작성
6. ✅ API 에러 처리 개선
7. ✅ RoadmapListItem 공통화
8. ✅ FilterTab 컴포넌트 통합

**효과**: 안정성 확보, 코드 중복 약 400줄 추가 감소

### Low Priority (중기 - 2-3개월)

9. ✅ 전체 페이지 통합 테스트
10. ✅ 성능 최적화
11. ✅ 접근성 감사 및 개선
12. ✅ Storybook 스토리 완성

**효과**: 코드 품질 향상, 사용자 경험 개선

---

## 다음 단계

1. **마이그레이션 가이드 확인**: [migration-guide.md](./migration-guide.md)
2. **Phase 1부터 시작**: shared 정리
3. **정기적인 진행 상황 체크**: 주 1회 회고
4. **점진적 마이그레이션**: 한 번에 하나의 기능씩

---

## 참고 자료

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application)
- [Component Driven Development](https://www.componentdriven.org/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
