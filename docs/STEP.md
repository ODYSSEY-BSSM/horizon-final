# 작업 진행 순서 (빠른 것부터)

> 시작: 2025-11-26
> 목표: 간단한 작업부터 빠르게 처리

---

## 🚀 즉시 완료 가능 (5분 미만)

| 순서 | ID | 작업 | 파일 | 상태 |
|------|-----|------|------|------|
| 1 | F-02 | auth export 추가 | `feature/auth/index.ts` | ✅ |
| 2 | F-03 | 로그인 리다이렉트 `/dashboard` 직접 | `signin/content.tsx` | ✅ |
| 3 | F-04 | `signupFlow.reset()` 추가 | `useUsernameForm.ts` | ✅ |
| 4 | F-21 | Middleware 중복 조건문 제거 | `middleware.ts` | ✅ |
| 5 | F-14 | console.log 제거 | (이미 없음) | ✅ |
| 6 | F-08 | 에러 메시지 프로덕션화 | `GeneralErrorPage.tsx` | ✅ |
| 7 | F-10 | Google OAuth 버튼 처리 | (이미 disabled) | ✅ |
| 8 | F-25 | 테스트 페이지 숨김 | `viewer/test/page.tsx` | ✅ |

---

## 📝 30분 내외 작업

| 순서 | ID | 작업 | 파일 | 상태 |
|------|------|------|------|------|
| 9 | F-01 | Dashboard 통계 계산 수정 | `useDashboardData.ts` | ⬜ |
| 10 | F-05 | 팀 Mutation Toast 추가 | `useTeamQueries.ts` | ⬜ |
| 11 | F-06 | STOMP 재연결 실패 알림 | `stompWebSocket.ts` | ⬜ |
| 12 | F-09 | Form 에러 필드별 초기화 | `roadmapFormStore.ts` | ⬜ |
| 13 | F-13 | Team Space 로딩 스피너 | `team-space/content.tsx` | ⬜ |
| 14 | F-16 | any 타입 제거 | 4개 파일 | ⬜ |
| 15 | F-17 | Error boundary reset 활용 | `error.tsx` 파일들 | ⬜ |
| 16 | F-22 | 팀 조인 에러 세분화 | `team-space/content.tsx` | ⬜ |
| 17 | F-23 | 타입 단언 개선 | `roadmap-viewer/page.tsx` | ⬜ |
| 18 | B-03 | 학교 노드 API 연동 | `EditorSidebar.tsx` | ⬜ |

---

## 🔧 1시간 이상 작업

| 순서 | ID | 작업 | 파일 | 상태 |
|------|------|------|------|------|
| 19 | F-26 | Edge를 parentNodeId에서 생성 | `nodeConverter.ts` | ⬜ |
| 20 | B-02 | Section/Text API 연동 | `RoadmapEditor.tsx` | ⬜ |
| 21 | B-09 | AI 도구 기능 연동 | `EditorToolbar.tsx` | ⬜ |
| 22 | E-03 | WebSocket 재연결 시 재구독 | `stompWebSocket.ts` | ⬜ |

---

## 🏗️ 대형 작업 (반나절+)

| ID | 작업 | 설명 | 상태 |
|----|------|------|------|
| F-07 | Feature import 수정 | 13개 파일 | ⬜ |
| F-11 | PageContainer 공통화 | 13개 파일 | ⬜ |
| B-04 | 퀴즈/문제 페이지 | 신규 feature 전체 | ⬜ |
| B-07 | WebSocket 핸들러 | 실시간 동기화 | ⬜ |
| E-01 | NodeGraph 통합 | 아키텍처 개선 | ⬜ |
| E-02 | Immer Patch 히스토리 | 메모리 최적화 | ⬜ |

---

## 진행 로그

### 2025-11-26

**Phase 1 완료 (8개 즉시 완료 작업)**
- ✅ F-02, F-03, F-04, F-21: 직접 수정
- ✅ F-14, F-10: 이미 처리되어 있음
- ✅ F-08: 에러 메시지 프로덕션화
- ✅ F-25: 테스트 페이지 환경변수 체크 추가

**Phase 2 진행 중...**

