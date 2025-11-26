# ISSUE-002: WebSocket 핸들러 미구현

## 개요
| 항목 | 내용 |
|------|------|
| **심각도** | 🔴 Critical |
| **영향 범위** | Editor, Viewer, 실시간 협업 |
| **관련 파일** | `src/feature/roadmap/editor/RoadmapEditor.tsx` |
| **상태** | Open |

## 문제 설명

RoadmapEditor에서 WebSocket 훅들이 연결되어 있지만, 실제 핸들러 구현이 모두 TODO 상태로 비어 있습니다. 이로 인해 실시간 협업 기능이 완전히 작동하지 않습니다.

## 미구현 핸들러 목록

### 1. 커서 공유 (useCursorWebSocket)
**위치**: `RoadmapEditor.tsx:168-176`

```typescript
useCursorWebSocket({
  roadmapId,
  onCursorMove: useCallback((_cursor: CursorReceiveMessage) => {
    // TODO: 커서 렌더링 구현 필요
  }, []),
  onCursorLeave: useCallback((_userId: string) => {
    // TODO: 커서 제거 구현 필요
  }, []),
});
```

**영향**:
- 다른 사용자의 커서 위치를 볼 수 없음
- 협업 시 누가 어디를 편집하는지 알 수 없음
- 동시 편집 충돌 가능성 증가

---

### 2. Section 노드 실시간 동기화 (useSectionWebSocket)
**위치**: `RoadmapEditor.tsx:178-191`

```typescript
useSectionWebSocket({
  onCreated: useCallback((_section: SectionMessage['section']) => {
    // TODO: Convert section to ReactFlow node and add to canvas
  }, []),
  onUpdated: useCallback((_update: SectionUpdateMessage) => {
    // TODO: Update section node on canvas
  }, []),
  onDeleted: useCallback((_sectionId: number) => {
    // TODO: Remove section node from canvas
  }, []),
});
```

**영향**:
- 다른 사용자가 생성/수정/삭제한 Section이 실시간으로 반영되지 않음
- 페이지 새로고침 전까지 다른 사용자의 변경사항을 볼 수 없음

---

### 3. Text 노드 실시간 동기화 (useTextWebSocket)
**위치**: `RoadmapEditor.tsx:193-206`

```typescript
useTextWebSocket({
  onCreated: useCallback((_text: TextMessage['texts']) => {
    // TODO: Convert text to ReactFlow node and add to canvas
  }, []),
  onUpdated: useCallback((_update: TextUpdateMessage) => {
    // TODO: Update text node on canvas
  }, []),
  onDeleted: useCallback((_textId: number) => {
    // TODO: Remove text node from canvas
  }, []),
});
```

**영향**:
- Text 노드의 실시간 동기화 불가
- 협업 시 텍스트 변경사항이 즉시 반영되지 않음

---

### 4. Viewer WebSocket 핸들러
**위치**: `RoadmapViewer.tsx:41-52`

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

**영향**:
- Viewer에서 실시간 업데이트가 반영되지 않음
- 편집자가 변경한 내용을 보려면 새로고침 필요

## 문제점 요약

| 기능 | 현재 상태 | 영향 |
|------|----------|------|
| 커서 공유 | ❌ 미구현 | 협업 시 다른 사용자 위치 모름 |
| Section 동기화 | ❌ 미구현 | Section 변경사항 실시간 반영 안됨 |
| Text 동기화 | ❌ 미구현 | Text 변경사항 실시간 반영 안됨 |
| Viewer 업데이트 | ❌ 미구현 | Viewer에서 실시간 확인 불가 |

## 해결 방안

### 1. 커서 렌더링 구현

```typescript
// 커서 상태 관리
const [remoteCursors, setRemoteCursors] = useState<Map<string, CursorPosition>>(new Map());

useCursorWebSocket({
  roadmapId,
  onCursorMove: useCallback((cursor: CursorReceiveMessage) => {
    setRemoteCursors(prev => {
      const next = new Map(prev);
      next.set(cursor.memberId, {
        x: cursor.x,
        y: cursor.y,
        memberName: cursor.memberName,
        color: cursor.color,
      });
      return next;
    });
  }, []),
  onCursorLeave: useCallback((userId: string) => {
    setRemoteCursors(prev => {
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  }, []),
});

// 커서 컴포넌트 렌더링
<RemoteCursors cursors={remoteCursors} />
```

### 2. Section/Text 노드 동기화 구현

```typescript
useSectionWebSocket({
  onCreated: useCallback((section: SectionMessage['section']) => {
    const newNode = convertSectionToNode(section);
    setNodes(nodes => [...nodes, newNode]);
  }, [setNodes]),
  onUpdated: useCallback((update: SectionUpdateMessage) => {
    setNodes(nodes => nodes.map(node =>
      node.id === `section-${update.id}`
        ? { ...node, data: { ...node.data, ...update } }
        : node
    ));
  }, [setNodes]),
  onDeleted: useCallback((sectionId: number) => {
    setNodes(nodes => nodes.filter(node => node.id !== `section-${sectionId}`));
  }, [setNodes]),
});
```

### 3. Viewer 실시간 업데이트 구현

```typescript
useRoadmapNodesWebSocket({
  roadmapId: Number(roadmapId),
  onCreated: useCallback((nodeData: RoadmapNodeMessage) => {
    const newNode = convertApiNodeToFlowNode(nodeData.node);
    setNodes(nodes => [...nodes, newNode]);
  }, [setNodes]),
  onUpdated: useCallback((nodeData: RoadmapNodeMessage) => {
    setNodes(nodes => nodes.map(node =>
      node.id === String(nodeData.node.id)
        ? convertApiNodeToFlowNode(nodeData.node)
        : node
    ));
  }, [setNodes]),
  onDeleted: useCallback((deleteMsg: NodeDeleteMessage) => {
    setNodes(nodes => nodes.filter(node => node.id !== String(deleteMsg.nodeId)));
  }, [setNodes]),
});
```

## 필요한 컴포넌트

### RemoteCursor 컴포넌트

```typescript
// src/feature/roadmap/editor/components/collaboration/RemoteCursor.tsx
interface RemoteCursorProps {
  x: number;
  y: number;
  name: string;
  color: string;
}

export function RemoteCursor({ x, y, name, color }: RemoteCursorProps) {
  return (
    <CursorContainer style={{ transform: `translate(${x}px, ${y}px)` }}>
      <CursorIcon color={color} />
      <CursorLabel color={color}>{name}</CursorLabel>
    </CursorContainer>
  );
}
```

## 구현 우선순위

1. **높음**: Viewer WebSocket 핸들러 (기본 실시간 기능)
2. **높음**: HorizonNode(일반 노드) 동기화 (이미 구현된 부분 보완)
3. **중간**: Section/Text 노드 동기화
4. **중간**: 커서 공유 기능

## 예상 작업량

| 작업 | 예상 시간 |
|------|----------|
| Viewer WebSocket 핸들러 | 3-4시간 |
| Section 동기화 | 4-6시간 |
| Text 동기화 | 4-6시간 |
| 커서 렌더링 (컴포넌트 포함) | 6-8시간 |
| 테스트 및 디버깅 | 4-6시간 |

## 참고

- [RoadmapEditor.tsx](../../../src/feature/roadmap/editor/RoadmapEditor.tsx)
- [RoadmapViewer.tsx](../../../src/feature/roadmap/viewer/RoadmapViewer.tsx)
- [useCursorWebSocket.ts](../../../src/feature/roadmap/editor/hooks/useCursorWebSocket.ts)
- [useSectionWebSocket.ts](../../../src/feature/roadmap/editor/hooks/useSectionWebSocket.ts)
- [useTextWebSocket.ts](../../../src/feature/roadmap/editor/hooks/useTextWebSocket.ts)
