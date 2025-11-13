# 로드맵 에디터 구현 TODO

이 문서는 로드맵 에디터 구현 시 필요한 백엔드 연결 기능과 구현 체크리스트를 정리합니다.

## 목차

- [구현된 API](#구현된-api)
- [Priority 0: 에디터 핵심 UI](#priority-0-에디터-핵심-ui)
- [Priority 1: 백엔드 연결 - 필수](#priority-1-백엔드-연결---필수)
- [Priority 2: 백엔드 연결 - 중요](#priority-2-백엔드-연결---중요)
- [Priority 3: 백엔드 연결 - 선택](#priority-3-백엔드-연결---선택)
- [API 참조](#api-참조)

---

## 구현된 API

모든 REST API와 WebSocket 구현이 완료되었습니다:
- ✅ REST API: `realNodeApi`, `realProblemApi`, `realRoadmapApi`, `realFolderApi`
- ✅ WebSocket: `useRoadmapNodesWebSocket`, `useCursorWebSocket`, `useTeamDirectoryWebSocket`
- ✅ 문서: `WEBSOCKET.md` 참고

---

## Priority 0: 에디터 핵심 UI

에디터 자체의 기본 동작을 위한 필수 UI/UX 기능 (1~8, 10번)

### 1. 캔버스 조작

#### 1.1 줌 인/아웃
- [ ] 마우스 휠 줌
  - 이벤트: `onWheel`
  - 줌 레벨 제한: 0.1x ~ 3x
  - 줌 중심점 = 마우스 커서 위치
- [ ] 줌 컨트롤 UI
  - 버튼: 줌 인(+), 줌 아웃(-), 리셋(100%)
  - 현재 줌 레벨 표시

#### 1.2 패닝 (캔버스 이동)
- [ ] Space + 드래그로 캔버스 이동
  - 이벤트: `onMouseDown`, `onMouseMove`, `onMouseUp`
  - Space 키 감지: `onKeyDown`, `onKeyUp`
- [ ] 중간 마우스 버튼 드래그
  - 이벤트: `button === 1` 감지
- [ ] 터치패드 제스처 지원
  - 두 손가락 드래그

#### 1.3 미니맵
- [ ] 전체 로드맵 미리보기
  - 모든 노드를 축소해서 표시
  - 캔버스 우측 하단 고정
- [ ] 현재 뷰포트 표시
  - 현재 보이는 영역을 박스로 표시
- [ ] 미니맵 클릭/드래그로 이동
  - 클릭한 위치로 뷰포트 이동

### 2. 노드 연결선 (부모-자식 관계)

#### 2.1 엣지 렌더링
- [ ] `parentNodeId` 기반 연결선 그리기
  - SVG 또는 Canvas로 렌더링
  - 부모 노드 → 자식 노드 방향
- [ ] 연결선 스타일
  - 베지어 곡선 또는 직선
  - 화살표 표시
  - 선택 시 하이라이트
- [ ] 연결선 충돌 감지
  - 클릭 가능한 영역 설정

#### 2.2 연결 생성/수정
- [ ] 드래그로 노드 연결
  - 노드에서 드래그 시작
  - 다른 노드에 드롭으로 연결
- [ ] 연결 끊기
  - 연결선 우클릭 → "연결 해제" 메뉴
  - 노드의 `parentNodeId`를 `null`로 설정
- [ ] 순환 참조 방지
  - 자식 노드를 부모로 연결할 수 없음
  - 연결 전 유효성 검사

### 3. 선택 및 다중 선택

#### 3.1 단일 선택
- [ ] 클릭으로 노드 선택
  - 선택된 노드 강조 (테두리 색상 변경)
  - 선택 상태 state 관리
- [ ] 빈 영역 클릭 시 선택 해제

#### 3.2 다중 선택
- [ ] Shift/Ctrl + 클릭
  - 기존 선택에 추가
  - 이미 선택된 노드 클릭 시 선택 해제
- [ ] 드래그로 영역 선택 (Lasso)
  - 드래그 영역 내 모든 노드 선택
  - 선택 영역 시각적 표시 (점선 박스)
- [ ] 전체 선택
  - 단축키: Ctrl+A
  - 모든 노드 선택

#### 3.3 다중 선택 노드 이동
- [ ] 선택된 노드들 일괄 이동
  - 한 노드를 드래그하면 모든 선택 노드 함께 이동
  - 상대 위치 유지

### 4. 실행 취소/재실행

- [ ] Undo (Ctrl+Z)
  - 히스토리 스택 관리
  - 로컬 작업만 취소 (서버 변경 제외)
  - 취소 가능한 작업:
    - 노드 생성/삭제
    - 노드 이동/크기 조절
    - 노드 내용 수정
    - 연결 생성/해제

- [ ] Redo (Ctrl+Y / Ctrl+Shift+Z)
  - 취소한 작업 다시 실행

- [ ] 히스토리 제한
  - 최대 50~100개 히스토리 유지
  - 메모리 관리

### 5. 복사/붙여넣기

#### 5.1 노드 복사
- [ ] Ctrl+C - 선택 노드 복사
  - 클립보드에 노드 데이터 저장
  - 다중 선택 지원

#### 5.2 노드 붙여넣기
- [ ] Ctrl+V - 노드 붙여넣기
  - 약간 오프셋된 위치에 생성 (x+20, y+20)
  - API: `realNodeApi.createNode()`
  - 부모-자식 관계 유지 (같은 구조로 복사)

#### 5.3 복제
- [ ] Ctrl+D - 선택 노드 즉시 복제
  - 복사 + 붙여넣기를 한 번에

### 6. 키보드 단축키

- [ ] **Delete** - 선택 노드 삭제
  - API: `realNodeApi.deleteNode()`
  - 확인 다이얼로그 표시

- [ ] **Ctrl+S** - 수동 저장
  - API: `realRoadmapApi.updateRoadmap()`

- [ ] **Escape** - 선택 해제
  - 모든 선택 상태 초기화

- [ ] **F2** - 노드 이름 편집
  - 선택된 노드의 제목 편집 모드 진입

- [ ] **방향키** - 선택 노드 미세 이동
  - 화살표 키로 1px 이동
  - Shift + 화살표로 10px 이동

- [ ] **Ctrl+마우스 휠** - 줌 (선택사항)
  - 휠만으로도 줌 가능하지만 Ctrl 조합도 지원

### 7. 자동 저장

#### 7.1 디바운싱 자동 저장
- [ ] 변경 후 2-3초 후 자동 저장
  - 디바운스를 사용해 연속 변경 시 마지막만 저장
  - API: `realRoadmapApi.updateRoadmap()`

- [ ] 저장 상태 표시
  - "저장 중..." 로딩 스피너
  - "저장됨" 체크 아이콘
  - "저장 실패" 에러 아이콘

- [ ] 마지막 저장 시간 표시
  - "1분 전 저장됨" 형식

#### 7.2 저장 실패 처리
- [ ] 에러 시 재시도
  - 3회까지 자동 재시도
  - 지수 백오프 (1초, 2초, 4초)

- [ ] 사용자 알림
  - 토스트 메시지로 실패 알림
  - 수동 재시도 버튼 제공

### 8. 충돌 해결 (협업)

#### 8.1 낙관적 업데이트 (Optimistic Update)
- [ ] 로컬 즉시 반영
  - 사용자 입력 시 UI 즉시 업데이트
  - 백그라운드에서 서버 전송

- [ ] 실패 시 롤백
  - API 에러 발생 시 이전 상태로 복구
  - 사용자에게 에러 알림

#### 8.2 동시 편집 충돌 처리
- [ ] WebSocket 변경사항 우선
  - 다른 사용자 변경 > 내 로컬 변경
  - 충돌 시 서버 데이터 우선 적용

- [ ] 충돌 알림 (선택사항)
  - "다른 사용자가 이 노드를 수정했습니다" 모달
  - "내 변경사항 유지" / "서버 변경사항 적용" 선택

#### 8.3 노드 편집 락 (선택사항)
- [ ] 편집 중 표시
  - 한 사용자가 노드를 편집 중이면 다른 사용자는 읽기 전용
  - 편집 중인 사용자 이름 표시

- [ ] 락 해제
  - 편집 완료 후 자동 해제
  - 일정 시간 후 자동 해제 (30초)

### 10. 성능 최적화

#### 10.1 가상화/뷰포트 컬링
- [ ] 화면 밖 노드 렌더링 스킵
  - 현재 뷰포트 영역만 렌더링
  - 스크롤 시 동적 렌더링

- [ ] 대량 노드 처리
  - 100개 이상 노드 시 가상화 적용
  - React Virtualized 또는 유사 라이브러리

#### 10.2 드래그 최적화
- [ ] 드래그 중 API 호출 스로틀링
  - 드래그 중에는 로컬만 업데이트
  - 드래그 끝날 때만 서버 전송
  - `onDragEnd` 이벤트 활용

- [ ] requestAnimationFrame 사용
  - 드래그/줌/패닝 시 부드러운 애니메이션

#### 10.3 WebSocket 메시지 최적화
- [ ] 메시지 배치 처리
  - 빠른 연속 변경 시 메시지 모아서 전송
  - 100ms 단위로 배치

- [ ] 메시지 압축 (선택사항)
  - 큰 데이터는 압축해서 전송

---

## Priority 1: 백엔드 연결 - 필수

에디터의 기본 동작을 위한 핵심 기능

### 1. 로드맵 조회 및 초기화

- [ ] 로드맵 ID로 로드맵 정보 조회
  - API: `realRoadmapApi.getRoadmap(roadmapId)`
  - 파일: `src/feature/roadmap/api/realRoadmapApi.ts:27`
  - 반환: 로드맵 기본 정보 (제목, 설명, 색상, 아이콘, 카테고리)

- [ ] 로드맵의 모든 노드 조회
  - API: `realNodeApi.getNodes(roadmapId)`
  - 파일: `src/feature/roadmap/api/realNodeApi.ts:16`
  - 반환: `NodeListResponse` (nodes 배열)

### 2. 노드 CRUD

#### 2.1 노드 생성
- [ ] 노드 생성 UI 구현
  - 드래그 앤 드롭 또는 더블클릭으로 노드 추가
- [ ] 노드 생성 API 연결
  - API: `realNodeApi.createNode(roadmapId, data)`
  - 파일: `src/feature/roadmap/api/realNodeApi.ts:21`
  - 필수 필드:
    ```typescript
    {
      title: string;        // 0-64자
      description: string;  // 0-1500자
      height: number;
      width: number;
      type: NodeType;       // 'TOP' | 'MIDDLE' | 'BOTTOM'
      x: number;
      y: number;
      color: Color;
      parentNodeId?: number; // 선택
    }
    ```

#### 2.2 노드 조회
- [ ] 특정 노드 상세 조회
  - API: `realNodeApi.getNode(roadmapId, nodeId)`
  - 파일: `src/feature/roadmap/api/realNodeApi.ts:26`
  - 사용: 노드 클릭 시 상세 정보 로드

#### 2.3 노드 수정
- [ ] 노드 위치 이동 (드래그)
  - 필드: `x`, `y`
- [ ] 노드 크기 조절 (리사이즈)
  - 필드: `height`, `width`
- [ ] 노드 내용 편집
  - 필드: `title`, `description`, `color`, `type`
- [ ] 노드 연결 변경 (부모 노드 변경)
  - 필드: `parentNodeId`
- [ ] 노드 수정 API 연결
  - API: `realNodeApi.updateNode(roadmapId, nodeId, data)`
  - 파일: `src/feature/roadmap/api/realNodeApi.ts:31`
  - 모든 필드 선택적 (변경된 필드만 전송)

#### 2.4 노드 삭제
- [ ] 노드 삭제 UI (컨텍스트 메뉴, 키보드 단축키)
- [ ] 노드 삭제 API 연결
  - API: `realNodeApi.deleteNode(roadmapId, nodeId)`
  - 파일: `src/feature/roadmap/api/realNodeApi.ts:40`
  - 주의: 자식 노드 처리 로직 필요

### 3. 노드 실시간 동기화 (WebSocket)

- [ ] 노드 WebSocket 연결
  - Hook: `useRoadmapNodesWebSocket`
  - 파일: `src/feature/roadmap/hooks/useRoadmapNodesWebSocket.ts`
  - Import: `import { useRoadmapNodesWebSocket } from '@/feature/roadmap';`

- [ ] 노드 생성 이벤트 수신
  - 토픽: `/topic/node/roadmap/{roadmapId}/created`
  - 콜백: `onCreated: (node: RoadmapNodeMessage) => void`
  - 동작: 다른 사용자가 노드를 생성하면 자동으로 캔버스에 추가

- [ ] 노드 삭제 이벤트 수신
  - 토픽: `/topic/node/roadmap/{roadmapId}/deleted`
  - 콜백: `onDeleted: (nodeId: number) => void`
  - 동작: 다른 사용자가 노드를 삭제하면 자동으로 캔버스에서 제거

- [ ] 특정 노드 수정 구독/해제
  - 사용자가 노드를 선택하면 해당 노드의 수정사항 구독
  - 메서드: `subscribeNodeUpdate(nodeId, handler)`
  - 메서드: `unsubscribeNodeUpdate(nodeId)`
  - 토픽: `/topic/roadmap/{roadmapId}/nodes/{nodeId}`

- [ ] 노드 수정사항 전송
  - 사용자가 노드를 수정하면 다른 사용자에게 전송
  - 메서드: `sendNodeUpdate(nodeId, updates)`
  - 경로: `/app/roadmap/{roadmapId}/nodes/{nodeId}`
  - 데이터:
    ```typescript
    {
      title: string;
      description: string;
      height: number;
      width: number;
      type: NodeType;
      x: number;
      y: number;
      color: string;
      parentNodeId: number | null;
    }
    ```

### 4. 로드맵 저장

- [ ] 자동 저장 또는 수동 저장 UI
- [ ] 로드맵 정보 수정 API 연결
  - API: `realRoadmapApi.updateRoadmap(roadmapId, data)`
  - 파일: `src/feature/roadmap/api/realRoadmapApi.ts:32`
  - 수정 가능: `title`, `description`, `categories`, `color`, `icon`, `directoryId`

---

## Priority 2: 백엔드 연결 - 중요

협업 및 고급 기능

### 5. 커서 공유 (다중 사용자 협업)

- [ ] 커서 WebSocket 연결
  - Hook: `useCursorWebSocket`
  - 파일: `src/feature/roadmap/hooks/useCursorWebSocket.ts`
  - Import: `import { useCursorWebSocket } from '@/feature/roadmap';`

- [ ] 내 커서 위치 전송
  - 이벤트: `onMouseMove`
  - 메서드: `sendCursorPosition({ x, y })`
  - 경로: `/app/roadmap/{roadmapId}/cursor`
  - 스로틀링 권장 (예: 100ms마다)

- [ ] 다른 사용자 커서 수신 및 렌더링
  - 토픽: `/topic/roadmap/{roadmapId}/cursor`
  - 콜백: `onCursorMove: (cursor: CursorReceiveMessage) => void`
  - 데이터:
    ```typescript
    {
      userId: number;
      userName: string;
      x: number;
      y: number;
    }
    ```
  - 상태: `otherCursors: CursorReceiveMessage[]`
  - 렌더링: 각 사용자별 커서와 이름 표시

- [ ] 사용자 나가기 처리
  - 메서드: `removeCursor(userId)`
  - 타이밍: 연결 끊김, 페이지 이동 시

### 6. 문제 추가 및 풀이

#### 6.1 문제 생성
- [ ] 노드에 문제 추가 UI
  - 노드 상세 패널에 문제 추가 버튼
- [ ] 문제 생성 API 연결
  - API: `realProblemApi.createProblem(nodeId, data)`
  - 파일: `src/feature/roadmap/api/realProblemApi.ts:10`
  - 필수 필드:
    ```typescript
    {
      title: string;   // 문제 제목
      answer: string;  // 정답
    }
    ```

#### 6.2 문제 풀이
- [ ] 문제 풀이 UI
  - 문제 목록 표시
  - 답안 입력 폼
- [ ] 문제 풀이 제출
  - API: `realProblemApi.solveProblem(nodeId, problemId, data)`
  - 파일: `src/feature/roadmap/api/realProblemApi.ts:15`
  - 데이터:
    ```typescript
    {
      answer: string;  // 제출한 답
    }
    ```
  - 반환: 문제 상태 (`UNRESOLVED` | `RESOLVED`)

- [ ] 문제 상태 표시
  - 노드에 문제 개수 및 해결 상태 표시
  - 진행률 계산 (NodeResponse.progress)

### 7. 교육과정 노드 전환

- [ ] 교육과정 노드 전환 UI
  - 노드 컨텍스트 메뉴에 "교육과정으로 전환" 옵션
  - 교과목 선택 드롭다운

- [ ] 교육과정 노드 전환 API
  - API: `realNodeApi.convertEducationNode(roadmapId, nodeId, data)`
  - 파일: `src/feature/roadmap/api/realNodeApi.ts:45`
  - 필수 필드:
    ```typescript
    {
      subject: Subject;  // 교과목
    }
    ```
  - Subject 타입: 백엔드 enum 확인 필요

- [ ] 교육과정 노드 표시
  - `NodeResponse.isEducation === true`인 경우 특별 표시
  - `NodeResponse.subject` 표시

---

## Priority 3: 백엔드 연결 - 선택

추가 편의 기능

### 8. 디렉토리 이동

- [ ] 로드맵 디렉토리 이동 UI
  - 에디터 헤더에 "이동" 버튼
  - 디렉토리 선택 모달

- [ ] 로드맵 디렉토리 변경
  - API: `realRoadmapApi.updateRoadmap(roadmapId, { directoryId })`
  - 파일: `src/feature/roadmap/api/realRoadmapApi.ts:32`

### 9. 팀 로드맵 생성

- [ ] 개인 로드맵을 팀 로드맵으로 복사
  - API: `realRoadmapApi.createTeamRoadmap(teamId, data)`
  - 파일: `src/feature/roadmap/api/realRoadmapApi.ts:65`

### 10. 로드맵 정보 표시

- [ ] 로드맵 통계
  - API: `realRoadmapApi.getRoadmapCount()`
  - 파일: `src/feature/roadmap/api/realRoadmapApi.ts:55`
  - 표시: 전체 로드맵 개수

- [ ] 최근 접근 로드맵
  - API: `realRoadmapApi.getLastAccessed()`
  - 파일: `src/feature/roadmap/api/realRoadmapApi.ts:50`
  - 사용: 에디터 진입 시 마지막 로드맵으로 리다이렉트

- [ ] 즐겨찾기 토글
  - API: `realRoadmapApi.toggleFavorite(roadmapId)`
  - 파일: `src/feature/roadmap/api/realRoadmapApi.ts:45`
  - UI: 에디터 헤더에 별 아이콘

---

## API 참조

### REST API

**로드맵 API** (`src/feature/roadmap/api/realRoadmapApi.ts`)
```typescript
import { realRoadmapApi } from '@/feature/roadmap/api';

// 조회
await realRoadmapApi.getRoadmap(roadmapId);
await realRoadmapApi.getRoadmaps();
await realRoadmapApi.getTeamRoadmaps(teamId);
await realRoadmapApi.getLastAccessed();
await realRoadmapApi.getRoadmapCount();

// 생성/수정/삭제
await realRoadmapApi.createRoadmap(data);
await realRoadmapApi.updateRoadmap(roadmapId, data);
await realRoadmapApi.deleteRoadmap(roadmapId);

// 기타
await realRoadmapApi.toggleFavorite(roadmapId);
await realRoadmapApi.createTeamRoadmap(teamId, data);
```

**노드 API** (`src/feature/roadmap/api/realNodeApi.ts`)
```typescript
import { realNodeApi } from '@/feature/roadmap/api';

// 조회
await realNodeApi.getNodes(roadmapId);
await realNodeApi.getNode(roadmapId, nodeId);

// 생성/수정/삭제
await realNodeApi.createNode(roadmapId, data);
await realNodeApi.updateNode(roadmapId, nodeId, data);
await realNodeApi.deleteNode(roadmapId, nodeId);

// 교육과정 전환
await realNodeApi.convertEducationNode(roadmapId, nodeId, { subject });
```

**문제 API** (`src/feature/roadmap/api/realProblemApi.ts`)
```typescript
import { realProblemApi } from '@/feature/roadmap/api';

// 생성/풀이
await realProblemApi.createProblem(nodeId, { title, answer });
await realProblemApi.solveProblem(nodeId, problemId, { answer });
```

### WebSocket Hooks

**노드 실시간 동기화** (`src/feature/roadmap/hooks/useRoadmapNodesWebSocket.ts`)
```typescript
import { useRoadmapNodesWebSocket } from '@/feature/roadmap';

const {
  isConnected,
  isSubscribed,
  subscribeNodeUpdate,
  unsubscribeNodeUpdate,
  sendNodeUpdate,
} = useRoadmapNodesWebSocket({
  roadmapId,
  autoSubscribe: true,
  onCreated: (node) => {
    // 다른 사용자가 노드를 생성함
    addNodeToCanvas(node);
  },
  onDeleted: (nodeId) => {
    // 다른 사용자가 노드를 삭제함
    removeNodeFromCanvas(nodeId);
  },
});

// 특정 노드 수정사항 구독
useEffect(() => {
  if (!selectedNodeId) return;

  subscribeNodeUpdate(selectedNodeId, (updates) => {
    // 다른 사용자가 노드를 수정함
    updateNodeInCanvas(selectedNodeId, updates);
  });

  return () => {
    unsubscribeNodeUpdate(selectedNodeId);
  };
}, [selectedNodeId]);

// 내가 노드를 수정했을 때 전송
const handleNodeChange = (nodeId, updates) => {
  sendNodeUpdate(nodeId, updates);
};
```

**커서 공유** (`src/feature/roadmap/hooks/useCursorWebSocket.ts`)
```typescript
import { useCursorWebSocket } from '@/feature/roadmap';

const {
  isConnected,
  otherCursors,
  sendCursorPosition,
  removeCursor,
} = useCursorWebSocket({
  roadmapId,
  autoSubscribe: true,
  onCursorMove: (cursor) => {
    console.log('Cursor moved:', cursor);
  },
});

// 마우스 이동 시 커서 위치 전송 (스로틀링 권장)
const handleMouseMove = throttle((e: React.MouseEvent) => {
  sendCursorPosition({ x: e.clientX, y: e.clientY });
}, 100);

// 다른 사용자 커서 렌더링
{otherCursors.map((cursor) => (
  <Cursor
    key={cursor.userId}
    x={cursor.x}
    y={cursor.y}
    userName={cursor.userName}
  />
))}
```

**팀 디렉토리 실시간 동기화** (`src/feature/team/hooks/useTeamDirectoryWebSocket.ts`)
```typescript
import { useTeamDirectoryWebSocket } from '@/feature/team';

const { isConnected, isSubscribed } = useTeamDirectoryWebSocket({
  teamId,
  autoSubscribe: true,
  onCreated: (directory) => {
    // 팀 디렉토리가 생성됨
  },
  onUpdated: (directory) => {
    // 팀 디렉토리가 수정됨
  },
  onDeleted: (directoryId) => {
    // 팀 디렉토리가 삭제됨
  },
});
```

---

## 추가 참고 자료

- **WebSocket 사용 가이드**: `WEBSOCKET.md`
- **프로젝트 가이드**: `CLAUDE.md`
- **API 타입 정의**:
  - 노드: `src/feature/roadmap/types/node.ts`
  - 문제: `src/feature/roadmap/types/problem.ts`
  - 로드맵: `src/feature/roadmap/types/roadmapApi.ts`
  - WebSocket 메시지: `src/shared/api/types/websocket.ts`

---

## 구현 참고 사항

### 에러 처리
- 모든 API 호출은 try-catch로 감싸기
- TanStack Query의 `useMutation` 사용 권장
- 에러 메시지 사용자에게 표시

### 성능 최적화
- 커서 위치 전송 시 스로틀링 (100ms 권장)
- 노드 수정 시 디바운싱 고려
- WebSocket 재연결 자동 처리됨 (최대 5회)

### 보안
- 모든 API 호출에 JWT 토큰 자동 포함
- 401 응답 시 자동 토큰 갱신
- WebSocket 연결 시 Authorization 헤더 자동 포함

### 타입 안전성
- 모든 API 응답은 타입 정의됨
- WebSocket 메시지 타입 사용 권장
- `ApiResponse<T>` 형식으로 래핑됨

---

## 권장 라이브러리

에디터 구현 시 유용한 라이브러리:

### Canvas/Flow 라이브러리
- **React Flow** (`@xyflow/react`)
  - 1, 2, 3번 기능 대부분 내장
  - 노드 기반 에디터 특화
  - 줌/패닝/미니맵/연결선 자동 처리

- **Konva.js** (`react-konva`)
  - Canvas 기반 렌더링
  - 높은 성능
  - 세밀한 커스터마이징 가능

### 유틸리티
- **lodash** - `throttle`, `debounce` 함수
- **immer** - 불변성 관리 (Undo/Redo)
- **use-gesture** - 제스처 처리
- **zustand** - 에디터 상태 관리 (이미 사용 중)

---

**마지막 업데이트**: 2025-11-13
**작성자**: Claude Code
