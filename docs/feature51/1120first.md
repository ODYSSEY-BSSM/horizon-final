# Feature #51 - Roadmap Editor API 연동 계획

작성일: 2025-11-20

## 1. 현재 상황 분석

### 기존 구현 완료 사항
- ✅ React Flow 기반 에디터 UI
- ✅ 노드 생성/수정/삭제 (로컬)
- ✅ 섹션 시스템 (부모-자식 관계)
- ✅ 드래그 & 드롭
- ✅ Undo/Redo (히스토리)
- ✅ z-index 레이어 관리
- ✅ 노드 타입별 사이드바

### 미구현 사항
- ❌ 서버 저장/불러오기
- ❌ API 연동
- ❌ 실시간 동기화 (WebSocket)
- ❌ 낙관적 업데이트
- ❌ 에러 핸들링
- ❌ 로딩 상태 관리

## 2. API 명세서 분석

### 주요 엔드포인트

#### 로드맵 관리
```
GET    /roadmap                            - 로드맵 목록 조회
POST   /roadmap                            - 로드맵 생성
PUT    /roadmap/{id}                       - 로드맵 업데이트
DELETE /roadmap/{id}                       - 로드맵 삭제
POST   /roadmap/{id}/favorite              - 즐겨찾기 토글
GET    /roadmap/last-accessed              - 최근 접근 로드맵 조회
GET    /roadmap/count                      - 로드맵 개수 조회
```

#### 노드 관리
```
GET    /roadmap/{roadmapId}/nodes          - 노드 목록 조회
POST   /roadmap/{roadmapId}/nodes          - 노드 생성
GET    /roadmap/{roadmapId}/nodes/{nodeId} - 노드 상세 조회
PUT    /roadmap/{roadmapId}/nodes/{nodeId} - 노드 업데이트
DELETE /roadmap/{roadmapId}/nodes/{nodeId} - 노드 삭제
PATCH  /roadmap/{roadmapId}/nodes/{nodeId} - 교육 메타데이터 업데이트 (subject)
PUT    /roadmap/{roadmapId}/nodes/ai       - AI 노드 생성/업데이트
```

### 데이터 구조

#### NodeRequest (클라이언트 → 서버)
```typescript
{
  title: string;           // max 64 chars (required)
  description: string;     // max 1500 chars (required)
  height: number;          // int32 (required)
  width: number;           // int32 (required)
  type: 'TOP' | 'MIDDLE' | 'BOTTOM';  // enum (required)
  x: number;               // int32 (required)
  y: number;               // int32 (required)
  color: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';  // enum (required)
  parentNodeId?: number;   // int64 (optional)
}
```

#### NodeResponse (서버 → 클라이언트)
```typescript
{
  id: number;              // int64
  title: string;
  description: string;
  height: number;          // int32
  width: number;           // int32
  type: 'TOP' | 'MIDDLE' | 'BOTTOM';
  x: number;               // int32
  y: number;               // int32
  color: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';
  roadmapId: number;       // int64
  parentNodeId: number;    // int64
  childNode: SimpleNodeResponse[];  // 자식 노드 배열
  progress: number;        // int32 (진행률)
  isEducation: boolean;
  subject: string;         // 교육 과목 (PATCH로 업데이트)
}
```

#### SimpleNodeResponse
```typescript
{
  id: number;              // int64
  title: string;
  description: string;
}
```

#### RoadmapRequest
```typescript
{
  title: string;           // max 64 chars
  description: string;     // max 150 chars
  directoryId: number;     // int64
  color: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';
  icon: 'LANGUAGE' | 'CODE' | 'SHIELD' | 'DATABASE' | ... // 18개 옵션
}
```

#### RoadmapResponse
```typescript
{
  roadmapInfo: {
    id: number;            // int64
    title: string;
    description: string;
    lastModifiedAt: string;   // date
    lastAccessedAt: string;   // date-time
    isFavorite: boolean;
  };
  uuid: number;            // int64
  color: string;
  icon: string;
  progress: number;        // int32
}
```

## 3. 데이터 형식 차이점

### 현재 구조 (React Flow)
```typescript
{
  id: string;
  type: 'horizonNode' | 'horizonSection' | 'horizonText';
  position: { x: number; y: number };
  data: {
    type?: 'title' | 'standard' | 'secondary';
    label?: string;
    title?: string;
    description?: string;
    color?: string;
    progress?: number;
    // ...
  };
  style?: { zIndex: number; width?: number; height?: number };
  parentNode?: string; // React Flow의 부모 노드 ID
  selected?: boolean;
}
```

### API 구조
```typescript
{
  id: number;              // int64
  title: string;
  description: string;
  height: number;          // int32
  width: number;           // int32
  type: 'TOP' | 'MIDDLE' | 'BOTTOM';
  x: number;               // int32
  y: number;               // int32
  color: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';
  parentNodeId: number;    // int64
  childNode: SimpleNodeResponse[];
  progress: number;
  isEducation: boolean;
  subject: string;
}
```

### 주요 차이점

| 항목 | React Flow | API | 변환 필요 |
|------|-----------|-----|----------|
| ID 타입 | `string` (Date.now()) | `number` (int64) | ✅ |
| 노드 타입 | `type: 'horizonNode'`<br>`data.type: 'title'` | `type: 'TOP'` | ✅ 매핑 필요 |
| 제목 | `data.label` or `data.title` | `title` | ✅ |
| 설명 | `data.description` | `description` | ✅ |
| 크기 | `style.width`, `style.height` | `width`, `height` | ✅ 필드명 변경 |
| 위치 | `position.x`, `position.y` | `x`, `y` | ✅ 필드명 변경 |
| 색상 | `data.color: 'blue'` | `color: 'BLUE'` | ✅ 대문자 변환 |
| 부모 | `parentNode: string` | `parentNodeId: number` | ✅ |
| 자식 | React Flow 자동 처리 | `childNode: []` | ✅ 응답 전용 |
| 진행률 | `data.progress` | `progress` | ✅ |
| z-index | `style.zIndex` | ❌ 없음 | 로컬 전용 |
| 선택 상태 | `selected` | ❌ 없음 | 로컬 전용 |
| Edge | 별도 배열 `edges[]` | ❌ 없음 | **🔍 Edge 손실 이슈** |

## 4. 구현해야 할 기능

### Phase 1: API 타입 및 변환 로직
- [ ] API 타입 정의 (`types/api.types.ts`)
  - `NodeRequest`
  - `NodeResponse`
  - `RoadmapResponse`
- [ ] 데이터 변환 유틸리티 (`utils/nodeConverter.ts`)
  - `reactFlowToApi(node: Node) => NodeRequest`
  - `apiToReactFlow(node: NodeResponse) => Node`
  - Edge 처리 방식 결정 필요

### Phase 2: API 클라이언트
- [ ] 노드 API 함수 (`api/nodeApi.ts`)
  - `createNode(roadmapId, nodeData)`
  - `getNodes(roadmapId)`
  - `updateNode(roadmapId, nodeId, nodeData)`
  - `deleteNode(roadmapId, nodeId)`
- [ ] TanStack Query 훅
  - `useNodes(roadmapId)` - 노드 목록 조회
  - `useCreateNode()` - 노드 생성
  - `useUpdateNode()` - 노드 업데이트
  - `useDeleteNode()` - 노드 삭제

### Phase 3: 에디터 통합
- [ ] 초기 로딩
  - roadmapId를 props/route params로 받기
  - `useNodes(roadmapId)`로 서버에서 노드 불러오기
  - API 데이터를 React Flow 형식으로 변환
  - `setNodes()` 호출
- [ ] 저장 로직
  - 현재 `handleSave()` TODO 구현
  - 변경된 노드만 필터링 (dirty checking)
  - React Flow 형식을 API 형식으로 변환
  - `updateNode()` 호출
  - 낙관적 업데이트 적용
- [ ] 노드 생성
  - `addNode()`, `addSection()`, `addText()` 수정
  - 로컬 추가 + API 호출
  - 서버 응답으로 ID 업데이트
- [ ] 노드 삭제
  - 삭제 버튼/단축키 추가
  - 로컬 삭제 + API 호출
  - 에러 시 롤백

### Phase 4: 에러 처리 및 UX
- [ ] 로딩 상태
  - 초기 로딩 스피너
  - 저장 중 표시 (기존 headerState 활용)
  - 노드별 로딩 상태 (생성/업데이트 중)
- [ ] 에러 핸들링
  - API 에러 토스트 메시지
  - 네트워크 오류 재시도
  - Conflict 처리 (동시 수정)
- [ ] 낙관적 업데이트
  - 즉시 UI 반영
  - 서버 응답 대기
  - 실패 시 롤백

### ~~Phase 5: 실시간 동기화~~ (별도 이슈로 진행)
- WebSocket 연동은 기본 API 연동 완료 후 별도 작업
- 이번 작업 범위: Phase 1~4까지만

## 5. 미해결 이슈 및 설계 결정

### 🚨 Critical: Edge 정보 손실 문제
- **문제**: API에 Edge 저장 방법이 없음
- **React Flow**: `edges[]` 배열로 `source`, `target` 연결 관리
- **API**: Edge 엔드포인트 없음, childNode는 단순 배열
- **대응 방안**:
  1. ⚠️ **임시**: Edge 정보를 로컬에만 저장 (새로고침 시 손실)
  2. ✅ **권장**: 백엔드 팀에게 Edge API 추가 요청
  3. 🔧 **차선**: Edge를 별도 로컬 스토리지나 description 필드에 JSON으로 저장
- **결정**: 백엔드 팀 확인 후 방향 결정

### 타입 매핑 (title/standard/secondary ↔ TOP/MIDDLE/BOTTOM)
- **React Flow 타입**: `'title'`, `'standard'`, `'secondary'`
- **API 타입**: `'TOP'`, `'MIDDLE'`, `'BOTTOM'`
- **매핑 규칙**:
  ```typescript
  const TYPE_MAPPING = {
    // React Flow → API
    title: 'TOP',
    standard: 'MIDDLE',
    secondary: 'BOTTOM',
    // API → React Flow
    TOP: 'title',
    MIDDLE: 'standard',
    BOTTOM: 'secondary',
  };
  ```

### 색상 매핑 (소문자 ↔ 대문자)
- **React Flow**: `'blue'`, `'red'`, `'green'` 등
- **API**: `'BLUE'`, `'RED'`, `'GREEN'` 등
- **변환**: `.toUpperCase()` / `.toLowerCase()`

### 섹션(Section) 처리
- **현재**: `type: 'horizonSection'` 별도 타입
- **API**: 섹션 개념 없음, 모두 노드
- **방안 1**: 섹션을 일반 노드로 저장 (width/height가 큰 노드)
- **방안 2**: 섹션을 `isSection` 플래그나 특정 타입으로 구분
- **방안 3**: 섹션을 로컬 전용으로 유지 (서버 저장 안 함)
- **결정**: 방안 1 선택 - 큰 크기의 노드로 저장, React Flow에서만 `horizonSection`으로 렌더링

### 텍스트(HorizonText) 처리
- **현재**: `type: 'horizonText'` 별도 타입
- **API**: 텍스트 개념 없음
- **방안**: 텍스트도 로컬 전용으로 유지 (서버 저장 안 함)
- **결정**: 로컬 전용 - 서버에 저장하지 않고 UI 편의 기능으로만 사용

### 좌표 시스템
- **React Flow**: 부모 노드가 있으면 부모 기준 상대 좌표
- **API**: `x`, `y` 필드만 있고 절대/상대 불명확
- **추정**: API는 절대 좌표를 사용하는 것으로 보임 (parentNodeId 있어도)
- **대응**:
  - 저장 시: 부모 기준 상대 좌표 → 절대 좌표 변환
  - 로드 시: 절대 좌표 → 부모 기준 상대 좌표 변환
- **검증 필요**: 실제 API 호출 테스트로 확인

### ID 관리
- **생성 시**: 로컬에서 임시 ID (`temp-${Date.now()}`)
- **서버 응답**: 실제 ID (number)로 교체
- **낙관적 업데이트**: 임시 ID → 실제 ID 매핑 관리 필요

## 6. 단계별 구현 우선순위

### 🔴 우선순위 1 (필수)
1. API 타입 정의
2. 데이터 변환 로직
3. 노드 조회 API 연동 (GET)
4. 초기 로딩 구현

### 🟡 우선순위 2 (중요)
5. 노드 업데이트 API 연동 (PUT)
6. 저장 로직 구현
7. 에러 핸들링
8. 로딩 상태 관리

### 🟢 우선순위 3 (추가)
9. 노드 생성 API 연동 (POST)
10. 노드 삭제 API 연동 (DELETE)
11. 낙관적 업데이트
12. Edge 로컬 스토리지 임시 저장

### ⏸️ 제외 (별도 이슈)
- WebSocket 실시간 동기화 (Phase 5)

## 7. 예상 이슈 및 대응 전략

### 1. Edge 정보 손실 (Critical)
- **문제**: API에 Edge 저장 방법 없음 → 연결 정보 손실
- **영향도**: 🔴 **High** - 로드맵의 핵심 기능 손상
- **대응 우선순위**:
  1. **즉시**: 백엔드 팀에게 Edge API 추가 요청
  2. **단기**: 임시로 로컬 스토리지 활용 (새로고침 유지)
  3. **중기**: Edge 정보를 description 필드에 JSON 인코딩
- **현재 결정**: Phase 1에서는 Edge 로컬 전용, Phase 2에서 백엔드 API 대응

### 2. 타입 불일치 (title/standard/secondary vs TOP/MIDDLE/BOTTOM)
- **문제**: 클라이언트와 서버 타입 체계 상이
- **영향도**: 🟡 **Medium** - 변환 로직으로 해결 가능
- **대응**:
  - 양방향 타입 매핑 상수 정의
  - 변환 유틸리티 함수 작성
  - 타입 안전성 보장 (TypeScript enum 활용)

### 3. 좌표 시스템 불일치
- **문제**: React Flow는 상대 좌표, API는 절대 좌표 (추정)
- **영향도**: 🟡 **Medium** - 부모-자식 관계에서 위치 오류 가능
- **대응**:
  - 좌표 변환 유틸리티 작성
  - 저장 시: 상대 → 절대 변환
  - 로드 시: 절대 → 상대 변환
  - 단위 테스트로 변환 로직 검증
  - 초기 API 테스트로 좌표 시스템 확인

### 4. 섹션/텍스트 노드 손실
- **문제**: API에 섹션/텍스트 개념 없음
- **영향도**: 🟢 **Low** - UI 편의 기능
- **대응**:
  - 섹션: 큰 크기 노드로 저장 (width/height > 500)
  - 텍스트: 로컬 전용, 서버 저장 안 함
  - 사용자에게 저장 범위 안내 (섹션은 저장됨, 텍스트는 임시)

### 5. ID 관리 및 낙관적 업데이트
- **문제**: 생성 시 임시 ID, 서버 응답 후 실제 ID로 교체
- **영향도**: 🟡 **Medium** - Edge 참조, 상태 관리 복잡도 증가
- **대응**:
  - 임시 ID 패턴: `temp-${Date.now()}-${Math.random()}`
  - ID 매핑 테이블 유지: `Map<tempId, realId>`
  - Edge source/target도 ID 업데이트
  - TanStack Query optimistic update 활용

### 6. 성능 문제 (대량 노드)
- **문제**: 노드 100개 이상 시 전체 저장 느림
- **영향도**: 🟢 **Low** - 일반적 사용에서는 문제 없음
- **대응**:
  - Dirty checking: 변경된 노드만 저장
  - Debounce 적용 (500ms)
  - 배치 업데이트 고려 (향후)
  - 로딩 상태 명확히 표시

### 7. 동시 수정 충돌
- **문제**: 여러 사용자 동시 수정 시 데이터 충돌
- **영향도**: 🟢 **Low** - 개인 로드맵이 대부분
- **대응**:
  - Phase 5 (WebSocket)에서 처리
  - 낙관적 잠금 (optimistic locking)
  - Last-write-wins 또는 사용자 선택 UI

### 8. API 필드 제약 사항
- **title**: max 64 chars
- **description**: max 1500 chars
- **대응**: 프론트엔드 유효성 검사 추가 (Zod schema)

## 8. 다음 단계 (상세 구현 계획)

### Step 1: API 타입 정의
- **파일**: `src/feature/roadmap/editor/types/api.types.ts`
- **내용**:
  - `NodeRequest`, `NodeResponse`, `SimpleNodeResponse`
  - `RoadmapRequest`, `RoadmapResponse`
  - API 색상/타입 enum
  - 타입 매핑 상수 (`TYPE_MAPPING`, `COLOR_MAPPING`)

### Step 2: 데이터 변환 유틸리티
- **파일**: `src/feature/roadmap/editor/utils/nodeConverter.ts`
- **함수**:
  - `reactFlowToApi(node: Node, allNodes: Node[]) => NodeRequest`
    - 상대 좌표 → 절대 좌표 변환
    - 타입/색상 매핑
    - 섹션 필터링 (horizonSection만 저장)
  - `apiToReactFlow(node: NodeResponse) => Node`
    - 절대 좌표 → 상대 좌표 변환 (부모 있을 경우)
    - 타입/색상 역매핑
  - `calculateAbsolutePosition(node, allNodes)`
  - `calculateRelativePosition(node, parent)`

### Step 3: API 클라이언트
- **파일**: `src/feature/roadmap/editor/api/nodeApi.ts`
- **함수**:
  - `createNode(roadmapId: number, data: NodeRequest)`
  - `getNodes(roadmapId: number)`
  - `updateNode(roadmapId: number, nodeId: number, data: NodeRequest)`
  - `deleteNode(roadmapId: number, nodeId: number)`
- **TanStack Query 훅**:
  - `useNodes(roadmapId)`
  - `useCreateNode()`
  - `useUpdateNode()`
  - `useDeleteNode()`

### Step 4: 에디터 통합
- **RoadmapEditor.tsx 수정**:
  - `roadmapId` prop 추가 (route params에서 받기)
  - `useNodes(roadmapId)` 로 초기 데이터 로드
  - `handleSave()` 구현
  - 에러/로딩 상태 UI
- **라우팅 수정**:
  - `/editor` → `/editor/[roadmapId]` 변경 검토
  - 또는 query param으로 roadmapId 전달

### Step 5: Edge 임시 처리
- **로컬 스토리지 활용**:
  - `localStorage.setItem('edges-${roadmapId}', JSON.stringify(edges))`
  - 초기 로드 시 로컬 스토리지에서 복원
- **백엔드 API 추가 요청** 동시 진행

## 9. 참고 사항

- **Swagger 문서**: https://raw.githubusercontent.com/leegunwoooo/swagger-ui/refs/heads/master/swagger.json
- **기존 API 클라이언트**: `src/shared/api/client.ts`
- **기존 WebSocket**: `src/shared/api/stompWebSocket.ts`
- **기존 타입**: `src/feature/roadmap/editor/types/node.types.ts`
