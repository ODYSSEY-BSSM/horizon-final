# Horizon-Final 프로젝트 종합 이슈 분석 보고서

> 분석 일자: 2025-11-26
> 분석 범위: 전체 레포지토리 (`src/` 디렉토리)

---

## 목차
1. [요약](#요약)
2. [Critical Issues (즉시 수정 필요)](#critical-issues-즉시-수정-필요)
3. [High Priority Issues (높은 우선순위)](#high-priority-issues-높은-우선순위)
4. [Medium Priority Issues (중간 우선순위)](#medium-priority-issues-중간-우선순위)
5. [Low Priority Issues (낮은 우선순위)](#low-priority-issues-낮은-우선순위)
6. [코드 품질 이슈](#코드-품질-이슈)
7. [미구현 기능 (TODO)](#미구현-기능-todo)
8. [아키텍처 개선 제안](#아키텍처-개선-제안)
9. [권장 수정 순서](#권장-수정-순서)

---

## 요약

| 카테고리 | 개수 | 상태 |
|---------|------|------|
| Critical Issues | 2 | 🔴 즉시 수정 필요 |
| High Priority | 4 | 🟠 빠른 수정 권장 |
| Medium Priority | 6 | 🟡 일정 내 수정 |
| Low Priority | 5 | 🟢 개선 권장 |
| 미구현 TODO | 12 | ⚪ 기능 완성 필요 |

---

## Critical Issues (즉시 수정 필요)

### 🔴 C-01: WebSocket 이중 구현으로 인한 혼란

**위치**:
- `src/shared/api/websocket.ts` (일반 WebSocket)
- `src/shared/api/stompWebSocket.ts` (STOMP 프로토콜)

**문제**:
두 개의 WebSocket 구현이 동시에 존재하며, 어느 것을 사용해야 하는지 불명확합니다.

```typescript
// websocket.ts: 일반 WebSocket 구현
class WebSocketClient {
  private ws: WebSocket | null = null;
}

// stompWebSocket.ts: STOMP 프로토콜 구현
class StompWebSocketClient {
  private client: Client;
}
```

**현재 사용 현황**:
- `useWebSocket.ts` → `websocket.ts` import
- `useStompWebSocket.ts` → `stompWebSocket.ts` import
- **하지만 실제 컴포넌트에서는 두 훅 모두 미사용** (`.tsx` 파일에서 사용처 없음)

**영향**:
- 개발자 혼란 유발
- 코드 중복
- 유지보수 비용 증가

**권장 해결책**:
1. 프로젝트에서 사용할 단일 WebSocket 구현 선택 (STOMP 권장 - 더 강력한 기능)
2. 미사용 구현체 제거
3. 문서화로 선택 이유 명시

---

### 🔴 C-02: Dashboard 통계 계산 로직 오류

**위치**: `src/feature/dashboard/hooks/useDashboardData.ts:46-51`

**문제**:
"진행 중인 로드맵" 계산 로직이 실제 progress 값이 아닌 `isFavorite` 플래그를 사용합니다.

```typescript
// 현재 코드 (잘못됨)
const myRoadmapsInProgress =
  roadmapsData?.filter((roadmap) => roadmap.roadmapInfo.isFavorite).length || 0;

// 의도한 로직 (올바름)
const myRoadmapsInProgress =
  roadmapsData?.filter((roadmap) => roadmap.progress > 0 && roadmap.progress < 100).length || 0;
```

**영향**:
- 대시보드 통계가 잘못 표시됨
- "내 진행 중인 로드맵"이 "즐겨찾기한 로드맵"과 동일하게 표시

**권장 해결책**:
```typescript
const myRoadmapsInProgress =
  roadmapsData?.filter((roadmap) => roadmap.progress > 0 && roadmap.progress < 100).length || 0;
```

---

## High Priority Issues (높은 우선순위)

### 🟠 H-01: 팀 관련 Mutation에서 Toast 알림 누락

**위치**: `src/feature/team/hooks/useTeamQueries.ts`

**문제**:
`useDeleteTeam`, `useApplyToTeam` 훅에서 성공/실패 시 Toast 알림이 없습니다.

```typescript
// useDeleteTeam: toast 없음
export function useDeleteTeam() {
  return useMutation({
    mutationFn: (teamId: number) => teamApi.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
      // ❌ toast 없음!
    },
    // ❌ onError 없음!
  });
}

// useApplyToTeam: toast 없음
export function useApplyToTeam() {
  return useMutation({
    onSuccess: () => {
      // ❌ toast 없음!
    },
    // ❌ onError 없음!
  });
}
```

**영향**: 사용자가 작업 결과를 피드백 받지 못함

**권장 해결책**:
```typescript
export function useDeleteTeam() {
  const { toast } = useToast();

  return useMutation({
    onSuccess: () => {
      toast({ variant: 'success', title: '팀 삭제 완료' });
    },
    onError: (error) => {
      toast({ variant: 'failed', title: '팀 삭제 실패', description: error.message });
    },
  });
}
```

---

### 🟠 H-02: Google OAuth 미구현

**위치**:
- `src/app/(auth)/signin/content.tsx:58`
- `src/app/(auth)/signup/content.tsx:21`

**문제**:
Google OAuth 로그인/회원가입 버튼이 UI에 존재하지만 실제 기능이 구현되지 않았습니다.

```typescript
// TODO: Google OAuth 흐름 구현 필요 (window.location.href = '/api/auth/google')
```

**영향**: 사용자가 Google 계정으로 로그인 시도 시 아무 반응 없음

**권장 해결책**:
1. Google OAuth API 엔드포인트 구현 (`/api/auth/google`)
2. OAuth 콜백 처리 로직 추가
3. 또는 UI에서 Google 로그인 버튼 임시 숨김

---

### 🟠 H-03: STOMP 재연결 실패 시 사용자 알림 없음

**위치**: `src/shared/api/stompWebSocket.ts:130-139`

**문제**:
최대 재연결 시도(5회) 초과 후 사용자에게 아무런 알림이 없습니다.

```typescript
private onDisconnect(_frame: IFrame): void {
  if (this.reconnectAttempts < this.maxReconnectAttempts) {
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), this.reconnectDelay);
  } else {
    // ❌ 최대 재연결 시도 초과 후 어떤 처리도 없음
    // ❌ 사용자에게 알림도 없음
  }
}
```

**영향**:
- 연결 끊김 상태에서 사용자가 인지하지 못함
- 실시간 기능이 작동하지 않아도 알 수 없음

**권장 해결책**:
```typescript
private onDisconnect(_frame: IFrame): void {
  if (this.reconnectAttempts < this.maxReconnectAttempts) {
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), this.reconnectDelay);
  } else {
    this.emitEvent('maxReconnectFailed');
    // 상위에서 이 이벤트를 구독하여 사용자에게 알림
  }
}
```

---

### 🟠 H-04: RoadmapToDirectoryMap의 any 타입 사용

**위치**: `src/feature/dashboard/hooks/useDashboardData.ts:79`

**문제**:
```typescript
const traverse = (directories: any[]): void => {  // ❌ any 타입
  for (const dir of directories) {
    // ...
  }
};
```

**영향**: 타입 안전성 부재, 런타임 에러 가능성

**권장 해결책**:
적절한 Directory 타입 정의 후 적용

---

## Medium Priority Issues (중간 우선순위)

### 🟡 M-01: Console.log 잔존

**위치**:
- `src/shared/api/websocket.ts:168`
- `src/shared/layout/Header/Header.tsx:84`

**문제**:
프로덕션 코드에 `console.error` 호출이 남아있습니다.

```typescript
// websocket.ts:168
console.error('Error parsing WebSocket message:', _error);

// Header.tsx:84
console.error('Logout failed:', _error);
```

**권장 해결책**:
1. 전역 에러 로깅 시스템 구축 (Sentry, LogRocket 등)
2. 또는 `console.error`를 제거하고 에러 이벤트로 전환

---

### 🟡 M-02: biome-ignore / eslint-disable 주석 정리 필요

**위치**:
- `src/feature/roadmap/editor/RoadmapEditor.tsx:343, 421, 870`
- `src/shared/providers/EmotionProvider.tsx:19`
- `src/shared/layout/Header/Header.tsx:83`
- `src/shared/api/websocket.ts:167`

**문제**:
lint 규칙 무시 주석이 6곳에 존재합니다. 일부는 정당한 이유가 있지만, 일부는 리팩토링으로 해결 가능합니다.

```typescript
// RoadmapEditor.tsx - 구조 분해로 unused variable 발생
// biome-ignore lint/correctness/noUnusedVariables: parentNode을 제거하기 위한 구조 분해
const { parentNode, ...restNode } = node;

// eslint-disable-next-line react-hooks/exhaustive-deps
```

**권장 해결책**:
- 정당한 무시: 주석에 명확한 이유 기재 (현재 일부 되어있음)
- `eslint-disable-next-line react-hooks/exhaustive-deps`: 의존성 배열 검토 필요

---

### 🟡 M-03: Form 에러 상태 관리 미흡

**위치**: `src/feature/roadmap/stores/roadmapFormStore.ts`

**문제**:
`updateField` 호출 시 모든 필드의 에러 상태가 초기화됩니다.

```typescript
updateField: <K extends keyof RoadmapFormData>(field: K, value: RoadmapFormData[K]) =>
  set(
    (state: RoadmapFormStore) => ({
      formData: { ...state.formData, [field]: value },
      errors: {},  // ❌ 모든 에러 초기화 - 다른 필드 에러도 제거됨
    }),
  ),
```

**영향**: 한 필드 수정 시 다른 필드의 검증 에러가 사라짐

**권장 해결책**:
```typescript
updateField: <K extends keyof RoadmapFormData>(field: K, value: RoadmapFormData[K]) =>
  set(
    (state: RoadmapFormStore) => ({
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: undefined },  // 해당 필드만 초기화
    }),
  ),
```

---

### 🟡 M-04: API 응답 런타임 검증 부재

**위치**: `src/shared/api/client.ts:104-115`

**문제**:
API 응답이 TypeScript 타입 단언만으로 처리되며, 런타임 검증이 없습니다.

```typescript
const result: ApiResponse<T> = await response.json();
// ❌ 타입 단언만 있고 런타임 검증 없음
return result.data;
```

**영향**:
- 백엔드 응답 형식 변경 시 무언의 오류 발생
- 디버깅 어려움

**권장 해결책**:
Zod 스키마를 활용한 런타임 검증 추가 (선택적)

---

### 🟡 M-05: 팀 선택 UI와 백엔드 API 불일치

**위치**: `src/feature/dashboard/hooks/useTeamStep.ts:9`

**문제**:
```typescript
// TODO: 백엔드 API 수정 또는 팀 선택 UI 제거 필요
```

팀 선택 단계의 UI와 실제 백엔드 API 간 불일치가 있습니다.

**영향**: 팀 선택 기능이 정상 작동하지 않을 수 있음

---

### 🟡 M-06: EditorSidebar에서 any 타입 및 타입 단언 사용

**위치**: `src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx:38, 72`

**문제**:
```typescript
[key: string]: any; // 확장성을 위한 인덱스 시그니처

const isSchoolNode = (nodeData as any)?.isSchoolNode ?? isSchoolNodeProp ?? false;
```

**영향**: 타입 안전성 저하

---

## Low Priority Issues (낮은 우선순위)

### 🟢 L-01: useSchoolConnect에서 queryClient.setQueryData의 any 타입

**위치**: `src/feature/school/hooks/useSchoolConnect.ts:137`

```typescript
queryClient.setQueryData(['user', 'profile'], (old: any) =>
```

---

### 🟢 L-02: 로드맵 뷰어/에디터 실시간 동기화 미완성

**위치**: `src/feature/roadmap/viewer/RoadmapViewer.tsx:44, 48`

```typescript
// TODO: Add node to canvas in real-time
// TODO: Remove node from canvas in real-time
```

---

### 🟢 L-03: 에디터 커서 렌더링 미구현

**위치**: `src/feature/roadmap/editor/RoadmapEditor.tsx:169`

```typescript
// TODO: 커서 렌더링 구현 필요
```

---

### 🟢 L-04: 에디터에서 Section/Text 노드 변환 미구현

**위치**: `src/feature/roadmap/editor/RoadmapEditor.tsx:178-199`

```typescript
// TODO: Convert section to ReactFlow node and add to canvas
// TODO: Update section node on canvas
// TODO: Convert text to ReactFlow node and add to canvas
// TODO: Update text node on canvas
```

---

### 🟢 L-05: 퀴즈 모달 미구현

**위치**: `src/feature/roadmap/viewer/RoadmapViewer.tsx:102`

```typescript
// TODO: 퀴즈 모달 또는 페이지로 이동
```

---

## 코드 품질 이슈

### 타입 안전성

| 위치 | 이슈 | 심각도 |
|-----|------|--------|
| `useDashboardData.ts:79` | `directories: any[]` | 🟡 Medium |
| `EditorSidebar.tsx:38` | `[key: string]: any` | 🟡 Medium |
| `EditorSidebar.tsx:72` | `as any` 타입 단언 | 🟡 Medium |
| `useSchoolConnect.ts:137` | `old: any` | 🟢 Low |

### 에러 처리

| 위치 | 이슈 | 심각도 |
|-----|------|--------|
| `stompWebSocket.ts:70-72` | 메시지 파싱 에러를 이벤트로만 전달 | 🟡 Medium |
| `websocket.ts:166-169` | 에러 console.error 후 조용히 무시 | 🟡 Medium |
| `client.ts:195-200` | 토큰 갱신 실패 시 에러 로깅 없음 | 🟢 Low |

---

## 미구현 기능 (TODO)

총 12개의 TODO 주석이 발견되었습니다.

### 인증 관련 (2개)
1. `signin/content.tsx:58` - Google OAuth 흐름 구현
2. `signup/content.tsx:21` - Google OAuth 흐름 구현

### 에디터 관련 (7개)
3. `RoadmapEditor.tsx:169` - 커서 렌더링 구현
4. `RoadmapEditor.tsx:178` - Section → ReactFlow 노드 변환
5. `RoadmapEditor.tsx:181` - Section 노드 업데이트
6. `RoadmapEditor.tsx:196` - Text → ReactFlow 노드 변환
7. `RoadmapEditor.tsx:199` - Text 노드 업데이트
8. `EditorSidebar.tsx:88` - 노드 변환 API 호출

### 뷰어 관련 (2개)
9. `RoadmapViewer.tsx:44` - 실시간 노드 추가
10. `RoadmapViewer.tsx:48` - 실시간 노드 제거
11. `RoadmapViewer.tsx:102` - 퀴즈 모달/페이지 이동

### 기타 (1개)
12. `useTeamStep.ts:9` - 백엔드 API 수정 또는 팀 선택 UI 제거

---

## 아키텍처 개선 제안

### 1. WebSocket 통합
현재 두 개의 WebSocket 구현이 존재하지만 실제로 사용되지 않습니다.
- **권장**: STOMP 구현 유지, 일반 WebSocket 제거
- **이유**: STOMP가 메시지 라우팅, 구독 관리 등 더 풍부한 기능 제공

### 2. 전역 에러 처리 시스템
현재 에러 처리가 분산되어 있습니다.
- **권장**: Error Boundary + Toast 통합 에러 처리 시스템 구축
- **구현**: `src/shared/providers/ErrorProvider.tsx` 생성

### 3. 타입 시스템 강화
`any` 타입 사용을 줄이고 타입 안전성 강화
- **권장**: 모든 API 응답에 대해 Zod 스키마 정의
- **단계적 적용**: 핵심 도메인(roadmap, team)부터 시작

### 4. 테스트 커버리지
현재 테스트가 거의 없는 상태
- **권장**: 핵심 hooks와 utils에 대한 단위 테스트 추가
- **우선순위**: `useRoadmapQueries`, `useDashboardData`, `apiClient`

---

## 권장 수정 순서

### Phase 1: Critical (즉시, 1-2일)
1. ✅ C-02: Dashboard 통계 계산 로직 수정
2. ⬜ C-01: WebSocket 구현 정리 및 단일화

### Phase 2: High Priority (1주일 내)
3. ⬜ H-01: 팀 Mutation Toast 알림 추가
4. ⬜ H-02: Google OAuth 구현 또는 UI 숨김
5. ⬜ H-03: STOMP 재연결 실패 알림 추가
6. ⬜ H-04: any 타입 제거 및 타입 정의

### Phase 3: Medium Priority (2주일 내)
7. ⬜ M-01: Console.log 정리
8. ⬜ M-02: lint-ignore 주석 정리
9. ⬜ M-03: Form 에러 상태 관리 개선
10. ⬜ M-04: API 응답 검증 추가 (선택)
11. ⬜ M-05: 팀 선택 UI/API 불일치 해결
12. ⬜ M-06: EditorSidebar 타입 개선

### Phase 4: Low Priority & TODO (일정에 따라)
- 에디터/뷰어 실시간 동기화 기능 완성
- 퀴즈 모달 구현
- 커서 렌더링 구현

---

## 부록: 파일별 이슈 요약

| 파일 | Critical | High | Medium | Low | TODO |
|-----|----------|------|--------|-----|------|
| `useDashboardData.ts` | 1 | 1 | - | - | - |
| `stompWebSocket.ts` | 1 | 1 | - | - | - |
| `websocket.ts` | 1 | - | 1 | - | - |
| `useTeamQueries.ts` | - | 1 | - | - | - |
| `signin/content.tsx` | - | 1 | - | - | 1 |
| `signup/content.tsx` | - | 1 | - | - | 1 |
| `RoadmapEditor.tsx` | - | - | 1 | - | 5 |
| `EditorSidebar.tsx` | - | - | 1 | - | 1 |
| `RoadmapViewer.tsx` | - | - | - | - | 3 |
| `roadmapFormStore.ts` | - | - | 1 | - | - |
| `Header.tsx` | - | - | 1 | - | - |
| `client.ts` | - | - | 1 | - | - |
| `useTeamStep.ts` | - | - | 1 | - | 1 |
| `useSchoolConnect.ts` | - | - | - | 1 | - |

---

*이 문서는 자동 분석 결과를 기반으로 작성되었습니다. 실제 수정 시에는 비즈니스 요구사항과 팀 일정을 고려하여 우선순위를 조정하시기 바랍니다.*