# Studio (Editor/Viewer) 분석 리포트

## 개요

이 문서는 `(studio)` 라우트 그룹 내의 Editor와 Viewer 기능에 대한 종합적인 분석을 담고 있습니다.

**분석 일자**: 2025-11-26

**분석 범위**:
- `/editor/[roadmapId]` - 로드맵 편집기
- `/viewer/[roadmapId]` - 로드맵 뷰어
- `/viewer/test` - 테스트 페이지

---

## 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [기능적 이슈](#기능적-이슈)
3. [누락된 기능](#누락된-기능)
4. [성능 이슈](#성능-이슈)
5. [코드 품질 이슈](#코드-품질-이슈)
6. [권장 개선사항](#권장-개선사항)

---

## 아키텍처 개요

### 파일 구조

```
src/app/(studio)/
├── editor/[roadmapId]/
│   ├── page.tsx          # Server Component (라우트 진입점)
│   └── content.tsx       # Client Component (ReactFlowProvider 래핑)
└── viewer/[roadmapId]/
    ├── page.tsx          # Server Component
    ├── content.tsx       # Client Component
    └── test/page.tsx     # 테스트 페이지

src/feature/roadmap/
├── editor/
│   ├── RoadmapEditor.tsx    # 메인 에디터 컴포넌트
│   ├── api/nodeApi.ts       # 노드 API 클라이언트
│   ├── components/          # 에디터 컴포넌트
│   ├── hooks/               # 에디터 훅
│   ├── store/               # Zustand 스토어
│   ├── types/               # 타입 정의
│   ├── utils/               # 유틸리티
│   └── constants/           # 상수
└── viewer/
    ├── RoadmapViewer.tsx    # 메인 뷰어 컴포넌트
    └── components/          # 뷰어 컴포넌트
```

### 주요 의존성
- **reactflow**: 노드 기반 캔버스 렌더링
- **@tanstack/react-query**: API 상태 관리
- **zustand**: 클라이언트 상태 관리
- **@emotion/styled**: CSS-in-JS 스타일링
- **STOMP WebSocket**: 실시간 동기화

---

## 기능적 이슈

### 🔴 Critical (즉시 수정 필요)

#### 1. Edge API 미지원 - localStorage 의존
**위치**: `src/feature/roadmap/editor/utils/edgeStorage.ts`

```typescript
// ⚠️ 주의: 로컬 스토리지는 임시 솔루션이며,
// 향후 백엔드 Edge API가 추가되면 제거될 예정입니다.
```

**문제**:
- Edge(연결선) 데이터가 서버에 저장되지 않고 localStorage에만 저장됨
- 다른 기기에서 로드맵 열면 연결선 정보 손실
- 브라우저 캐시 삭제 시 데이터 영구 손실
- 협업 시 다른 사용자가 연결선을 볼 수 없음

**영향**: 데이터 무결성 심각한 손상 가능

---

#### 2. WebSocket 핸들러 미구현 (TODO 상태)
**위치**: `src/feature/roadmap/editor/RoadmapEditor.tsx:168-208`

```typescript
// TODO: 커서 렌더링 구현 필요
useCursorWebSocket({
  roadmapId,
  onCursorMove: useCallback((_cursor: CursorReceiveMessage) => {
    // TODO: 커서 렌더링 구현 필요
  }, []),
});

// TODO: Convert section to ReactFlow node and add to canvas
useSectionWebSocket({
  onCreated: useCallback((_section: SectionMessage['section']) => {
    // TODO: Convert section to ReactFlow node and add to canvas
  }, []),
  onUpdated: useCallback((_update: SectionUpdateMessage) => {
    // TODO: Update section node on canvas
  }, []),
});

// TODO: Convert text to ReactFlow node and add to canvas
useTextWebSocket({
  onCreated: useCallback((_text: TextMessage['texts']) => {
    // TODO: Convert text to ReactFlow node and add to canvas
  }, []),
  onUpdated: useCallback((_update: TextUpdateMessage) => {
    // TODO: Update text node on canvas
  }, []),
});
```

**문제**:
- 실시간 커서 공유 기능 미작동
- Section/Text 노드의 실시간 동기화 미구현
- 협업 기능 불완전

---

#### 3. Viewer WebSocket 핸들러 미구현
**위치**: `src/feature/roadmap/viewer/RoadmapViewer.tsx:41-52`

```typescript
useRoadmapNodesWebSocket({
  roadmapId: Number(roadmapId),
  onCreated: useCallback((_nodeData: RoadmapNodeMessage) => {
    // TODO: Add node to canvas in real-time
    // For now, viewer will refetch on next load
  }, []),
  onDeleted: useCallback((_nodeId: NodeDeleteMessage) => {
    // TODO: Remove node from canvas in real-time
    // For now, viewer will refetch on next load
  }, []),
});
```

**문제**: Viewer에서 실시간 업데이트가 반영되지 않음

---

### 🟡 Major (주요 기능 이슈)

#### 4. Section/Text 노드 API 미연동
**위치**: `src/feature/roadmap/editor/RoadmapEditor.tsx:469-470`

```typescript
// horizonNode만 필터링
const horizonNodes = nodes.filter((node) => node.type === 'horizonNode');
```

**문제**:
- Section과 Text 노드는 서버에 저장되지 않음
- 로컬에서만 존재하는 임시 데이터 상태
- 페이지 새로고침 시 Section/Text 노드 손실

---

#### 5. 퀴즈 기능 미구현
**위치**: `src/feature/roadmap/viewer/RoadmapViewer.tsx:101-103`

```typescript
const handleQuizClick = useCallback(() => {
  // TODO: 퀴즈 모달 또는 페이지로 이동
}, []);
```

**문제**: ViewerSidebar의 "확인 문제 풀기" 버튼이 작동하지 않음

---

#### 6. 학교 노드 전환 API 미연동
**위치**: `src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx:86-97`

```typescript
const handleToggleConfirm = (_curriculumId: string) => {
  setIsConverting(true);
  // TODO: API call to convert node with _curriculumId

  // Simulate async operation
  setTimeout(() => {
    onNodeUpdate?.('isSchoolNode', !isSchoolNode);
    setIsConverting(false);
    setIsToggleModalOpen(false);
  }, 500);
};
```

**문제**: 학교 노드 전환이 로컬 상태만 변경하고 서버에 반영되지 않음

---

### 🟢 Minor (경미한 이슈)

#### 7. 하드코딩된 기본 색상
**위치**: `src/feature/roadmap/editor/RoadmapEditor.tsx:127`

```typescript
color: 'blue' as ApiColor, // Default color since WebSocket message doesn't include it
```

**문제**: WebSocket 메시지에 색상 정보가 없을 때 기본값이 하드코딩됨

---

#### 8. AI 도구 기능 미구현
**위치**: `src/feature/roadmap/editor/components/toolbar/EditorToolbar/EditorToolbar.tsx:66-77`

```typescript
<ToolbarItem
  type="ai"
  icon="wand_shine"
  hasDropdown
  dropdownOptions={[
    { icon: 'wand_shine', text: '로드맵 생성', value: 'generate' },
    { icon: 'model_training', text: '선택항목 수정', value: 'edit-selection' },
  ]}
  onDropdownSelect={onAiActionSelect}
/>
```

**문제**: AI 도구 버튼이 있지만 `onAiActionSelect` 핸들러가 구현되지 않음

---

## 누락된 기능

### 1. Edge API 및 서버 동기화
- 연결선 생성/수정/삭제 API 필요
- WebSocket을 통한 실시간 Edge 동기화

### 2. Section API
- Section 노드 CRUD API 필요
- WebSocket 핸들러 구현

### 3. Text API
- Text 노드 CRUD API 필요
- WebSocket 핸들러 구현

### 4. 실시간 커서 공유
- 다른 사용자의 커서 위치 표시
- 커서 렌더링 컴포넌트

### 5. 퀴즈 시스템
- 퀴즈 모달/페이지
- 퀴즈 데이터 API 연동
- 진행률 계산 및 저장

### 6. AI 기능
- 로드맵 자동 생성
- 선택 항목 AI 수정

### 7. 충돌 해결 메커니즘
- 동시 편집 시 충돌 감지
- 충돌 해결 UI

### 8. 오프라인 지원
- Service Worker를 통한 오프라인 편집
- 온라인 복귀 시 동기화

---

## 성능 이슈

### 1. 불필요한 리렌더링
**위치**: `src/feature/roadmap/editor/RoadmapEditor.tsx:641-658`

```typescript
useEffect(() => {
  setNodes((nds) => {
    // 변경이 필요한지 먼저 확인
    const needsUpdate = nds.some((node) => {
      const shouldBeSelected = node.id === selectedNodeId;
      return node.selected !== shouldBeSelected;
    });

    if (!needsUpdate) {
      return nds;
    }
    // ...
  });
}, [selectedNodeId, setNodes]);
```

**문제**: 선택 상태 동기화를 위해 전체 노드를 순회함

### 2. 히스토리 메모리 사용
**위치**: `src/feature/roadmap/editor/hooks/useHistory.ts`

```typescript
const MAX_HISTORY = 50;
```

**문제**:
- 히스토리에 전체 노드/엣지 상태 저장
- 노드가 많을 경우 메모리 사용량 급증

### 3. 자동 저장 간격
```typescript
const AUTO_SAVE_INTERVAL_MS = 30000; // 30초
```

**문제**: 30초 간격이 데이터 손실 가능성 있음

---

## 코드 품질 이슈

### 1. 타입 안전성 문제
**위치**: `src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx:38-39`

```typescript
interface NodeData {
  // ...
  [key: string]: any; // 확장성을 위한 인덱스 시그니처
}
```

**문제**: `any` 타입 사용으로 타입 안전성 저하

### 2. 비일관적인 에러 처리
**위치**: `src/feature/roadmap/editor/api/nodeApi.ts:34-37`

```typescript
} catch (_error) {
  // 에러 발생 시 빈 배열 반환하여 undefined 방지
  return [];
}
```

**문제**: 에러를 무시하고 빈 배열 반환, 디버깅 어려움

### 3. 테스트 페이지 프로덕션 노출
**위치**: `src/app/(studio)/viewer/test/page.tsx`

**문제**: 테스트 페이지가 프로덕션 빌드에 포함됨

---

## 권장 개선사항

### 단기 (1-2주)

1. **Edge API 구현 및 연동**
   - 백엔드 Edge CRUD API 개발
   - localStorage 의존성 제거

2. **WebSocket 핸들러 완성**
   - Section/Text 실시간 동기화
   - 커서 공유 구현

3. **에러 처리 개선**
   - 적절한 에러 로깅
   - 사용자 피드백 UI

### 중기 (3-4주)

4. **Section/Text API 연동**
   - 서버 저장 기능 구현
   - 데이터 일관성 보장

5. **퀴즈 기능 구현**
   - 퀴즈 모달 개발
   - API 연동

6. **학교 노드 API 연동**
   - 전환 API 호출
   - 교육 과정 연동

### 장기 (1-2개월)

7. **AI 기능 구현**
   - 로드맵 자동 생성
   - 선택 항목 수정

8. **충돌 해결 시스템**
   - OT(Operational Transform) 또는 CRDT 도입
   - 충돌 UI

9. **성능 최적화**
   - 가상화(Virtualization) 적용
   - 히스토리 압축

---

## 개별 이슈 파일

- [ISSUE-001: Edge API 미지원](./ISSUE-001-edge-api.md)
- [ISSUE-002: WebSocket 핸들러 미구현](./ISSUE-002-websocket-handlers.md)
- [ISSUE-003: Section/Text API 미연동](./ISSUE-003-section-text-api.md)
- [ISSUE-004: 퀴즈 기능 미구현](./ISSUE-004-quiz-feature.md)
- [ISSUE-005: 학교 노드 API 미연동](./ISSUE-005-school-node-api.md)
