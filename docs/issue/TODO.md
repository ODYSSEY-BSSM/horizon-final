# Horizon 프로젝트 이슈 정리 (TODO)

> 정리 일자: 2025-11-26
> 참고: 인증 로직(쿠키/httpOnly) 수정 예정 없음

---

## 목차
1. [프론트엔드 단독 수정 가능](#1-프론트엔드-단독-수정-가능)
2. [백엔드 협업 필요](#2-백엔드-협업-필요)
3. [수정 안 함 (Skip)](#3-수정-안-함-skip)
4. [에디터 아키텍처 개선](#4-에디터-아키텍처-개선-프론트-단독)
5. [우선순위 요약](#5-우선순위-요약)

---

| ID          | 내용          | 상태  |
  |-------------|-------------|-----|
| F-01 ~ F-17 | 이전 세션에서 완료  | ✅   |
| F-22        | 팀 조인 에러 세분화 | ✅   |
| F-23        | 타입 단언 개선    | ✅   |

## 1. 프론트엔드 단독 수정 가능

### 🔴 Critical (즉시)

| ID | 이슈 | 파일 | 설명 |
|----|------|------|------|
| F-01 | Dashboard 통계 계산 오류 | `useDashboardData.ts:46-51` | `isFavorite` 대신 `progress` 값으로 "진행 중" 계산해야 함 |
| F-02 | Export 누락 | `feature/auth/index.ts` | `useLogout`, `useUserProfile` export 추가 필요 |
| F-03 | 로그인 후 이중 리다이렉트 | `signin/content.tsx:51` | `/` → `/dashboard` 직접 이동으로 변경 |
| F-04 | 회원가입 완료 후 상태 미정리 | `useUsernameForm.ts` | `signupFlow.reset()` 호출 추가 |
| F-26 | Edge를 parentNodeId에서 생성 | `nodeConverter.ts` | localStorage 대신 노드 계층에서 Edge 자동 생성, `edgeStorage.ts` 제거 |

### 🟡 High (1주 내)

| ID | 이슈                    | 파일 | 설명 |
|----|-----------------------|------|------|
| F-05 | 팀 Mutation Toast 누락   | `useTeamQueries.ts` | `useDeleteTeam`, `useApplyToTeam`에 성공/실패 Toast 추가 |
| F-06 | STOMP 재연결 실패 알림 없음    | `stompWebSocket.ts:130-139` | 최대 재연결 시도 초과 시 사용자 알림 |
| F-07 | Feature 내부 경로 직접 Import | `(main)/**/*.tsx` (13개 파일) | feature `index.ts` 통해 import하도록 수정 |
| F-08 | Error 메시지 비전문적        | `GeneralErrorPage.tsx:14-15` | 프로덕션 적합 메시지로 변경 |
| F-09 | Form 에러 상태 전체 초기화     | `roadmapFormStore.ts` | 해당 필드만 초기화하도록 수정 |
| F-10 | Google OAuth 버튼 처리    | `signin/content.tsx`, `signup/content.tsx` | 미구현이면 버튼 숨김 또는 disabled 표시 |

### 🟢 Medium (2주 내)

| ID | 이슈 | 파일 | 설명 |
|----|------|------|------|
| F-11 | StyledPageContainer 중복 | 13개 파일 | `shared/layout/PageContainer.tsx` 공통화 |
| F-12 | Loading/Error 스타일 중복 | `team-space/**` | 공통 컴포넌트로 추출 |
| F-13 | Team Space 리다이렉트 시 빈 화면 | `team-space/content.tsx:105-108` | 로딩 스피너 표시 |
| F-14 | Console.log 잔존 | `websocket.ts:168`, `Header.tsx:84` | 제거 또는 에러 로깅 시스템 연동 |
| F-15 | biome-ignore/eslint-disable 정리 | 6개 파일 | 정당한 이유 기재 또는 리팩토링 |
| F-16 | any 타입 사용 | `useDashboardData.ts:79`, `EditorSidebar.tsx:38,72`, `useSchoolConnect.ts:137` | 적절한 타입 정의 |
| F-17 | Error boundary reset 미활용 | 모든 `error.tsx` | `reset` prop 활용하여 재시도 기능 |
| F-18 | Breadcrumb 동적 데이터 미구현 | `navigation.ts:19-27` | 폴더/팀 이름 실제 값으로 표시 |
| F-19 | Modal 상태 관리 비일관성 | 여러 content.tsx | useState vs Zustand 통일 |

### 🔵 Low (일정에 따라)

| ID | 이슈 | 파일 | 설명 |
|----|------|------|------|
| F-20 | roadmap-viewer loading/error 누락 | `roadmap-viewer/[id]/` | `loading.tsx`, `error.tsx` 추가 |
| F-21 | Middleware 중복 조건문 | `middleware.ts:13,25` | 두 번째 `if (isLoggedIn)` 제거 |
| F-22 | 팀 조인 에러 세분화 | `team-space/content.tsx:83-86` | 에러 타입별 메시지 구분 |
| F-23 | 타입 단언 개선 | `roadmap-viewer/[id]/page.tsx:189` | `params.id` 유효성 검증 |
| F-24 | WebSocket 이중 구현 정리 | `websocket.ts`, `stompWebSocket.ts` | 하나로 통일 (STOMP 권장) |
| F-25 | 테스트 페이지 프로덕션 노출 | `viewer/test/page.tsx` | 환경 변수로 숨김 처리 |

---

## 2. 백엔드 협업 필요 / 신규 Feature

### 🔴 Critical (API 있음 - 프론트 연동 필요)

| ID | 이슈 | 설명 | API 상태 |
|----|------|------|----------|
| B-02 | Section/Text 노드 API 연동 | Section/Text 노드 서버 저장 안 됨 | ✅ API 존재: `POST/PATCH/DELETE /{roadmap-id}/section`, `/{roadmap-id}/text` |
| B-03 | 학교 노드 전환 API 연동 | 로컬 상태만 변경, 서버 미반영 | ✅ API 존재: `PATCH /roadmap/{id}/nodes/{nodeId}` (subject 필드) |

### 🟡 High (신규 Feature 구현 필요)

| ID | 이슈 | 설명 | API 상태 |
|----|------|------|----------|
| B-04 | **퀴즈/문제 페이지 신규 구현** | (studio) 라우트에 퀴즈 UI 전체 구현 필요 | ✅ API 존재: `POST /{nodeId}/problems`, `POST /{nodeId}/problems/ai`, `PATCH /{nodeId}/problems` |
| B-05 | 팀 선택 UI/API 불일치 | `useTeamStep.ts`에 TODO 표시 | 백엔드 API 스펙 확인 필요 |
| B-09 | AI 도구 기능 연동 | "로드맵 생성", "선택항목 수정" 버튼 미구현 | ✅ API 존재: `POST /directories/{id}/nodes/ai`, `PUT /roadmap/{id}/nodes/ai` |

### 🟢 Medium (WebSocket 연동)

| ID | 이슈 | 설명 | 필요 사항 |
|----|------|------|----------|
| B-07 | WebSocket 핸들러 구현 | 커서/Section/Text 실시간 동기화 TODO 상태 | WebSocket 메시지 스펙 확정 (WS API 문서 참고) |
| B-08 | Viewer 실시간 업데이트 | `RoadmapViewer.tsx` TODO 상태 | WebSocket 이벤트 확인 |

### 🔴 백엔드 API 미존재

| ID | 이슈 | 설명 | 필요 API |
|----|------|------|----------|
| B-06 | Google OAuth | 버튼 있지만 미구현 | `/api/auth/google` 엔드포인트 필요 |

---

## 3. 수정 안 함 (Skip)

### 인증 관련 (수정 예정 없음)

| ID | 이슈 | 이유 |
|----|------|------|
| S-01 | Cookie httpOnly 설정 | 인증 로직 수정 안 함 |
| S-02 | Access Token 메모리 노출 | 인증 로직 수정 안 함 |
| S-03 | 클라이언트 Rate Limiting | 인증 로직 수정 안 함 |
| S-04 | 비밀번호 찾기/재설정 UI | API는 있으나 UI 미구현 - 현재 범위 외 |
| S-05 | 로그인 유지 (Remember Me) | 현재 범위 외 |
| S-06 | 세션 관리 (다중 기기) | 현재 범위 외 |
| S-07 | 토큰 만료 알림 | 현재 범위 외 |

### 기타 미진행

| ID | 이슈 | 이유 |
|----|------|------|
| S-08 | API 응답 런타임 검증 (Zod) | 선택 사항, 현재 범위 외 |
| S-09 | 에디터 커서 렌더링 | WebSocket 핸들러 완성 후 진행 |
| S-10 | 오프라인 지원 | 장기 과제 |
| S-11 | 충돌 해결 시스템 (OT/CRDT) | 장기 과제 |

---

## 4. 에디터 아키텍처 개선 (프론트 단독)

> 백엔드 변경 없이 프론트엔드만으로 에디터 로직 개선
> 필요 패키지: `bun add immer rbush && bun add -D @types/rbush`

### 🟡 High (구조 개선)

| ID | 이슈 | 파일 | 설명 |
|----|------|------|------|
| E-01 | NodeGraph 통합 (F-26 확장) | 신규: `useNodeGraph.ts` | 좌표 계산/Edge 생성/부모-자식 관계를 단일 모듈로 통합. `nodeConverter.ts`의 `calculateAbsolutePosition`, `edgeStorage.ts` 제거 |
| E-02 | Immer Patch 히스토리 | `useHistory.ts` | 전체 스냅샷 대신 diff(patch)만 저장. 메모리 80-90% 절감, `immer` 사용 |
| E-03 | WebSocket 재연결 시 재구독 | `stompWebSocket.ts` | `pendingSubscriptions` 보존하여 재연결 시 자동 재구독. F-06 확장 |

### 🟢 Medium (최적화)

| ID | 이슈 | 파일 | 설명 |
|----|------|------|------|
| E-04 | Command Queue 패턴 | 신규: `useEditorCommands.ts` | 저장 로직 분리. CREATE/UPDATE/DELETE 명령 큐잉 후 일괄 실행. `handleSave` 450줄 → 10줄 |
| E-05 | 공간 인덱싱 (R-tree) | 신규: `useSpatialIndex.ts` | 섹션 탐색 O(n) → O(log n). `rbush` 사용. 노드 많아지면 드래그 성능 개선 |
| E-06 | Zustand isDirty 플래그 | `editorStore.ts` | 저장 안 된 변경사항 추적. 페이지 이탈 시 경고 |

### 구현 상세

**E-01 NodeGraph 통합:**
```typescript
// 현재 문제: 좌표 계산이 3곳에 흩어짐
// - nodeConverter.ts: calculateAbsolutePosition
// - RoadmapEditor.tsx: onNodeDragStop 내 직접 계산
// - reactFlowToApi에서 또 계산

// 해결: 단일 관리자
interface NodeGraph {
  getAbsolutePosition(id: string): Position;
  getRelativePosition(id: string, parentId: string): Position;
  getEdges(): Edge[];  // parentNodeId 기반 자동 생성
  reparent(nodeId: string, newParentId?: string): void;
}
```

**E-02 Immer Patch 히스토리:**
```typescript
// 현재: 노드 100개 × 히스토리 50개 = 5000개 객체
// 개선: patch만 저장 (변경된 부분만)
import { produceWithPatches, applyPatches } from 'immer';
// undo = inversePatches 적용, redo = patches 적용
```

**E-03 WebSocket 재구독:**
```typescript
// 현재 문제: onDisconnect에서 subscriptions.clear()
// → 재연결 시 구독 정보 날아감

// 해결: pendingSubscriptions 별도 보관
private pendingSubscriptions: Map<string, Handler>;
// onConnect에서 자동 재구독
```

---

## 5. 우선순위 요약

### Phase 1: Critical 수정 (즉시)

**프론트엔드 단독:**
- [ ] F-01: Dashboard 통계 계산 수정 (`isFavorite` → `progress` 값으로 변경)
- [ ] F-02: auth export 추가 (`useLogout`, `useUserProfile`)
- [ ] F-03: 로그인 리다이렉트 수정 (`/` → `/dashboard` 직접 이동)
- [ ] F-04: 회원가입 상태 정리 (`signupFlow.reset()` 호출)
- [ ] F-26: Edge를 parentNodeId에서 자동 생성 (localStorage 제거)

**API 존재 - 프론트 연동:**
- [ ] B-02: Section/Text API 연동 (API 있음 ✅)
- [ ] B-03: 학교 노드 전환 API 연동 (API 있음 ✅)

### Phase 2: High Priority (1주)

**프론트엔드:**
- [ ] F-05: 팀 Mutation Toast 알림 추가 (`useDeleteTeam`, `useApplyToTeam`)
- [ ] F-06: STOMP 최대 재연결 초과 시 사용자 알림
- [ ] F-07: Feature 내부 경로 → `index.ts` import 수정 (13개 파일)
- [ ] F-08: 에러 메시지 프로덕션 적합하게 변경
- [ ] F-09: Form 에러 상태 해당 필드만 초기화
- [ ] F-10: Google OAuth 버튼 disabled/숨김 처리

**신규 Feature (API 있음 ✅):**
- [ ] B-04: **퀴즈/문제 페이지 구현** - `(studio)/quiz/[nodeId]` 신규 라우트 + UI
- [ ] B-09: AI 도구 기능 연동 (로드맵 생성, 선택항목 수정)

**백엔드 확인 필요:**
- [ ] B-05: 팀 선택 UI/API 불일치 해결

### Phase 3: Medium Priority (2주)

**에디터 아키텍처 (프론트 단독):**
- [ ] E-01: NodeGraph 통합 - 좌표/Edge/부모-자식 단일 모듈화 (F-26 확장)
- [ ] E-02: Immer Patch 히스토리 - 메모리 최적화
- [ ] E-03: WebSocket 재연결 시 자동 재구독 (F-06 확장)

**프론트엔드:**
- [ ] F-11: `StyledPageContainer` 공통화 (13개 파일 → `shared/layout/`)
- [ ] F-12: Loading/Error 스타일 공통 컴포넌트로 추출
- [ ] F-13: Team Space 리다이렉트 시 로딩 스피너 표시
- [ ] F-14: Console.log 잔존 제거 (`websocket.ts`, `Header.tsx`)
- [ ] F-15: biome-ignore/eslint-disable 정리 (6개 파일)
- [ ] F-16: `any` 타입 제거 (4개 파일)
- [ ] F-17: Error boundary `reset` prop 활용
- [ ] F-18: Breadcrumb 동적 데이터 구현
- [ ] F-19: Modal 상태 관리 통일 (useState vs Zustand)

**WebSocket 연동:**
- [ ] B-07: WebSocket 핸들러 구현 (커서/Section/Text 실시간 동기화)
- [ ] B-08: Viewer 실시간 업데이트

### Phase 4: Low Priority (일정에 따라)

**에디터 최적화:**
- [ ] E-04: Command Queue 패턴 - 저장 로직 분리 (`handleSave` 450줄 → 10줄)
- [ ] E-05: 공간 인덱싱 R-tree - 섹션 탐색 O(n) → O(log n)
- [ ] E-06: Zustand isDirty 플래그 - 페이지 이탈 경고

**기타:**
- [ ] F-20: roadmap-viewer `loading.tsx`, `error.tsx` 추가
- [ ] F-21: Middleware 중복 조건문 제거
- [ ] F-22: 팀 조인 에러 타입별 메시지 구분
- [ ] F-23: 타입 단언 개선 (`params.id` 유효성 검증)
- [ ] F-24: WebSocket 이중 구현 → STOMP 통일
- [ ] F-25: 테스트 페이지 프로덕션 노출 숨김

---

## 파일별 이슈 매핑

| 파일/디렉토리 | 관련 이슈 |
|--------------|----------|
| `feature/auth/` | F-02, F-04 |
| `(auth)/signin/` | F-03, F-10 |
| `(auth)/signup/` | F-10 |
| `(main)/dashboard/` | F-01 |
| `(main)/team-space/` | F-05, F-07, F-12, F-13, F-22 |
| `(main)/my-roadmaps/` | F-07 |
| `shared/api/` | F-06, F-14, F-24 |
| `shared/layout/` | F-11, F-14 |
| `shared/components/ErrorPage/` | F-08 |
| `shared/utils/navigation.ts` | F-18 |
| `feature/roadmap/editor/` | F-26, B-02, B-03, B-07, F-16, E-01, E-02, E-04, E-05, E-06 |
| `shared/api/stompWebSocket.ts` | F-06, E-03 |
| `feature/roadmap/viewer/` | B-08, F-20 |
| `(studio)/quiz/` | B-04 (신규 라우트) |
| `feature/quiz/` | B-04 (신규 feature 모듈) |
| `feature/roadmap/stores/` | F-09 |
| `feature/team/hooks/` | F-05 |
| `middleware.ts` | F-21 |

---

## 참고 문서

- [main.md](./main.md) - (main) 라우트 그룹 이슈
- [auth.md](./auth.md) - 인증 기능 이슈
- [all.md](./all.md) - 전체 이슈 종합
- [studio/README.md](./studio/README.md) - Editor/Viewer 이슈 요약
- [studio/ISSUE-002-websocket-handlers.md](./studio/ISSUE-002-websocket-handlers.md) - WebSocket 핸들러 상세
- [studio/ISSUE-003-section-text-api.md](./studio/ISSUE-003-section-text-api.md) - Section/Text API 상세 (✅ API 존재)
- [studio/ISSUE-004-quiz-feature.md](./studio/ISSUE-004-quiz-feature.md) - 퀴즈 기능 상세 (✅ API 존재)
- [studio/ISSUE-005-school-node-api.md](./studio/ISSUE-005-school-node-api.md) - 학교 노드 API 상세 (✅ API 존재)

## API 명세서

- [api_document.md](../api_document.md) - REST API 명세
- [api_ws_document.md](../api_ws_document.md) - WebSocket API 명세
