# 로드맵 에디터 이슈 수정 가이드

발견된 이슈 7개에 대한 수정 방법입니다. 우선순위 순으로 정리했습니다.

---

## 🔴 Issue #1: 저장 로직 인덱스 불일치 (CRITICAL)

**파일:** `src/feature/roadmap/editor/RoadmapEditor.tsx:250-297`

**문제:**
`reactFlowNodesToApi()`는 horizonNode만 필터링하는데, `nodes[index]`로 전체 배열 인덱스를 사용해서 잘못된 노드를 업데이트합니다.

**현재 코드 (잘못됨):**
```typescript
const handleSave = useCallback(async () => {
  if (!roadmapId) {
    toast({
      title: 'Error',
      description: 'Roadmap ID is required',
      variant: 'destructive',
    });
    return;
  }

  setHeaderState('saving');

  try {
    // React Flow 노드를 API 형식으로 변환
    const apiNodeRequests = reactFlowNodesToApi(nodes);  // ❌ horizonNode만 필터링됨

    // 각 노드 업데이트 (병렬 처리)
    await Promise.all(
      apiNodeRequests.map((nodeRequest, index) => {
        const nodeId = Number.parseInt(nodes[index].id, 10);  // ❌ 잘못된 인덱스
        if (Number.isNaN(nodeId)) {
          return Promise.resolve();
        }
        return updateNodeMutation.mutateAsync({ nodeId, data: nodeRequest });
      }),
    );

    setHeaderState('saved');
    toast({
      title: 'Success',
      description: 'Roadmap saved successfully',
      variant: 'default',
    });

    setTimeout(() => {
      setHeaderState('editing');
    }, 3000);
  } catch (error) {
    setHeaderState('editing');
    toast({
      title: 'Save failed',
      description: error instanceof Error ? error.message : 'Failed to save roadmap',
      variant: 'destructive',
    });
  }
}, [roadmapId, nodes, updateNodeMutation, toast]);
```

**수정 코드:**
```typescript
const handleSave = useCallback(async () => {
  if (!roadmapId) {
    toast({
      title: 'Error',
      description: 'Roadmap ID is required',
      variant: 'destructive',
    });
    return;
  }

  setHeaderState('saving');

  try {
    // horizonNode만 필터링
    const horizonNodes = nodes.filter((node) => node.type === 'horizonNode');

    // React Flow 노드를 API 형식으로 변환
    const apiNodeRequests = reactFlowNodesToApi(nodes);

    // 각 노드 업데이트 (병렬 처리)
    await Promise.all(
      apiNodeRequests.map((nodeRequest, index) => {
        const nodeId = Number.parseInt(horizonNodes[index].id, 10);  // ✅ 필터링된 배열 사용
        if (Number.isNaN(nodeId)) {
          // 새로 생성된 노드는 임시 ID를 가지므로 스킵 (향후 createNode로 처리)
          return Promise.resolve();
        }
        return updateNodeMutation.mutateAsync({ nodeId, data: nodeRequest });
      }),
    );

    setHeaderState('saved');
    toast({
      title: 'Success',
      description: 'Roadmap saved successfully',
      variant: 'default',
    });

    setTimeout(() => {
      setHeaderState('editing');
    }, 3000);
  } catch (error) {
    setHeaderState('editing');
    toast({
      title: 'Save failed',
      description: error instanceof Error ? error.message : 'Failed to save roadmap',
      variant: 'destructive',
    });
  }
}, [roadmapId, nodes, updateNodeMutation, toast]);
```

**변경 사항:**
- `horizonNodes` 변수 추가하여 horizonNode만 필터링
- `nodes[index]` → `horizonNodes[index]` 변경

---

## 🔴 Issue #2: Edge localStorage 경합 조건 (CRITICAL)

**파일:** `src/feature/roadmap/editor/RoadmapEditor.tsx:79-412`

**문제:**
컴포넌트 마운트 시 localStorage에서 로드하기 전에 빈 배열을 저장하여 기존 데이터를 덮어씁니다.

**현재 코드 (잘못됨):**
```typescript
export const RoadmapEditor = ({ roadmapId }: RoadmapEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [headerState, setHeaderState] = useState<EditorHeaderState>('editing');

  // ... 다른 코드 ...

  // 초기 로드: localStorage에서 Edge 복원
  useEffect(() => {
    if (roadmapId && roadmapId > 0) {
      const savedEdges = loadEdges(roadmapId);
      if (savedEdges.length > 0) {
        setEdges(savedEdges);
      }
    }
  }, [roadmapId, setEdges]);

  // Edge 변경 시 자동으로 localStorage에 저장
  useEffect(() => {
    if (roadmapId && roadmapId > 0 && edges.length >= 0) {  // ❌ 항상 true
      saveEdges(roadmapId, edges);  // ❌ 초기 빈 배열 저장 가능
    }
  }, [roadmapId, edges]);
```

**수정 코드:**
```typescript
export const RoadmapEditor = ({ roadmapId }: RoadmapEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [headerState, setHeaderState] = useState<EditorHeaderState>('editing');
  const [isEdgesLoaded, setIsEdgesLoaded] = useState(false);  // ✅ 로드 완료 플래그 추가

  // ... 다른 코드 ...

  // 초기 로드: localStorage에서 Edge 복원
  useEffect(() => {
    if (roadmapId && roadmapId > 0) {
      const savedEdges = loadEdges(roadmapId);
      if (savedEdges.length > 0) {
        setEdges(savedEdges);
      }
      setIsEdgesLoaded(true);  // ✅ 로드 완료 표시
    }
  }, [roadmapId, setEdges]);

  // Edge 변경 시 자동으로 localStorage에 저장 (로드 완료 후에만)
  useEffect(() => {
    if (isEdgesLoaded && roadmapId && roadmapId > 0) {  // ✅ 로드 완료 확인
      saveEdges(roadmapId, edges);
    }
  }, [isEdgesLoaded, roadmapId, edges]);
```

**변경 사항:**
1. `isEdgesLoaded` state 추가
2. 로드 effect에서 `setIsEdgesLoaded(true)` 호출
3. 저장 effect에 `isEdgesLoaded` 조건 추가
4. 불필요한 `edges.length >= 0` 조건 제거

---

## 🟡 Issue #3: 히스토리 메모리 누수 (MAJOR)

**파일:** `src/feature/roadmap/editor/hooks/useHistory.ts:16-34`

**문제:**
히스토리가 무제한으로 증가하여 메모리 누수가 발생합니다.

**현재 코드:**
```typescript
export const useHistory = () => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveState = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1);
        return [...newHistory, { nodes, edges }];  // ❌ 무제한 증가
      });
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex],
  );

  // ... 나머지 코드
```

**수정 코드:**
```typescript
const MAX_HISTORY = 50;  // ✅ 최대 히스토리 개수

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveState = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1);
        const updatedHistory = [...newHistory, { nodes, edges }];

        // ✅ 최대 개수 제한
        if (updatedHistory.length > MAX_HISTORY) {
          const trimmed = updatedHistory.slice(-MAX_HISTORY);
          setCurrentIndex(MAX_HISTORY - 1);
          return trimmed;
        }

        return updatedHistory;
      });

      // currentIndex 업데이트 (MAX_HISTORY 초과하지 않은 경우만)
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next >= MAX_HISTORY ? MAX_HISTORY - 1 : next;
      });
    },
    [currentIndex],
  );

  // ... 나머지 코드
```

**변경 사항:**
1. `MAX_HISTORY = 50` 상수 추가
2. 히스토리 길이 체크 후 초과 시 오래된 항목 제거
3. `currentIndex` 조정 로직 추가

---

## 🟡 Issue #4: Edge z-index Effect 잘못된 의존성 (MAJOR)

**파일:** `src/feature/roadmap/editor/RoadmapEditor.tsx:310-317`

**문제:**
의존성 배열이 잘못되어 새 edge에 z-index가 적용되지 않습니다.

**현재 코드:**
```typescript
// edge에 z-index 자동 추가 (섹션 위에 표시)
useEffect(() => {
  setEdges((eds) =>
    eds.map((edge) => ({
      ...edge,
      style: { ...edge.style, zIndex: 1 },
    })),
  );
}, [setEdges]);  // ❌ 잘못된 의존성
```

**수정 방법 1 - Effect 제거 (권장):**

이미 `defaultEdgeOptions`에 z-index가 설정되어 있고, `onConnect`도 제대로 작동하므로 이 effect는 불필요합니다.

```typescript
// ✅ Effect 전체 삭제
// defaultEdgeOptions={{ type: 'horizonEdge', style: { zIndex: 1 } }}에서 이미 처리됨
```

**수정 방법 2 - onConnect 수정 (대안):**

Effect를 유지하고 싶다면:

```typescript
const onConnect = useCallback(
  (connection: Connection) => {
    setEdges((eds) =>
      addEdge({ ...connection, style: { zIndex: 1 } }, eds)
    );
  },
  [setEdges],
);

// Effect는 삭제
```

**권장:** 방법 1 (Effect 삭제) - 코드가 더 간결하고 `defaultEdgeOptions`가 이미 역할을 하고 있습니다.

**변경 사항:**
- Lines 310-317 전체 삭제

---

## 🟡 Issue #5: ID 생성 충돌 위험 (MODERATE)

**파일:** `src/feature/roadmap/editor/hooks/useNodeCreator.ts:20` 등

**문제:**
`Date.now()`만 사용하여 빠른 클릭 시 중복 ID가 생성될 수 있습니다.

**현재 코드:**
```typescript
const addNode = useCallback(
  (type: NodeType, position = { x: 250, y: 250 }) => {
    const newNode = {
      id: `node-${Date.now()}`,  // ❌ 충돌 가능
      type: 'horizonNode',
      position,
      data: createNodeData(type),
      style: { zIndex: 1 },
    };

    setNodes((nds) => [...nds, newNode]);
    return newNode.id;
  },
  [setNodes],
);

const addSection = useCallback(
  (position = { x: 100, y: 100 }, size = { width: 600, height: 400 }) => {
    const newSection = {
      id: `section-${Date.now()}`,  // ❌ 충돌 가능
      // ...
    };
    // ...
  },
  [setNodes],
);

const addText = useCallback(
  (textType: 'title' | 'paragraph' = 'paragraph', position = { x: 250, y: 250 }) => {
    const newText = {
      id: `text-${Date.now()}`,  // ❌ 충돌 가능
      // ...
    };
    // ...
  },
  [setNodes],
);
```

**수정 코드:**
```typescript
// ✅ 파일 상단에 카운터 추가
let idCounter = 0;

export const useNodeCreator = () => {
  const { setNodes } = useReactFlow();

  const addNode = useCallback(
    (type: NodeType, position = { x: 250, y: 250 }) => {
      const newNode = {
        id: `node-${Date.now()}-${idCounter++}`,  // ✅ 고유성 보장
        type: 'horizonNode',
        position,
        data: createNodeData(type),
        style: { zIndex: 1 },
      };

      setNodes((nds) => [...nds, newNode]);
      return newNode.id;
    },
    [setNodes],
  );

  const addSection = useCallback(
    (position = { x: 100, y: 100 }, size = { width: 600, height: 400 }) => {
      const newSection = {
        id: `section-${Date.now()}-${idCounter++}`,  // ✅ 고유성 보장
        type: 'horizonSection',
        position,
        data: { label: 'New Section', color: 'blue' as const },
        style: { width: size.width, height: size.height, zIndex: 0 },
        selected: false,
      };

      setNodes((nds) => [...nds, newSection]);
      return newSection.id;
    },
    [setNodes],
  );

  const addText = useCallback(
    (textType: 'title' | 'paragraph' = 'paragraph', position = { x: 250, y: 250 }) => {
      const newText = {
        id: `text-${Date.now()}-${idCounter++}`,  // ✅ 고유성 보장
        type: 'horizonText',
        position,
        data: { type: textType, text: 'New Text' },
        style: { zIndex: 1 },
      };

      setNodes((nds) => [...nds, newText]);
      return newText.id;
    },
    [setNodes],
  );

  return { addNode, addSection, addText };
};
```

**변경 사항:**
1. 파일 상단에 `let idCounter = 0;` 추가
2. 모든 ID 생성을 `${Date.now()}-${idCounter++}` 형식으로 변경

---

**추가 옵션 - crypto.randomUUID() 사용 (더 견고함):**

```typescript
const addNode = useCallback(
  (type: NodeType, position = { x: 250, y: 250 }) => {
    const newNode = {
      id: `node-${crypto.randomUUID()}`,  // ✅ UUID 사용
      // ...
    };
    // ...
  },
  [setNodes],
);
```

**참고:** `crypto.randomUUID()`는 모든 모던 브라우저에서 지원되며, 완전한 고유성을 보장합니다.

---

## 🟢 Issue #6: 빈 임시저장 핸들러 (MINOR)

**파일:** `src/feature/roadmap/editor/RoadmapEditor.tsx:244-247`

**문제:**
버튼은 있지만 아무 동작도 하지 않습니다.

**현재 코드:**
```typescript
const handleTempSave = useCallback(() => {
  // TODO: 임시저장 API 호출
}, []);
```

**수정 코드:**
```typescript
const handleTempSave = useCallback(() => {
  toast({
    title: 'Coming Soon',
    description: 'Temporary save feature is under development',
    variant: 'default',
  });
}, [toast]);
```

**변경 사항:**
- TODO 주석을 토스트 메시지로 교체
- 의존성 배열에 `toast` 추가

---

## 🟢 Issue #7: Edge 타입 전파 검증 (MINOR)

**파일:** `src/feature/roadmap/editor/RoadmapEditor.tsx:476`

**현재 상태:**
```typescript
defaultEdgeOptions={{ type: 'horizonEdge', style: { zIndex: 1 } }}
```

**검증 방법:**
1. 개발 서버 실행
2. 두 노드 연결
3. React DevTools에서 edge의 `type` 속성 확인
4. `horizonEdge`인지 확인

**만약 `default` 타입이면:**
```typescript
const onConnect = useCallback(
  (connection: Connection) => {
    setEdges((eds) =>
      addEdge({ ...connection, type: 'horizonEdge' }, eds)  // ✅ 명시적으로 타입 지정
    );
  },
  [setEdges],
);
```

---

## 📋 수정 우선순위

1. **🔴 Issue #1** - 저장 로직 인덱스 (데이터 손실 방지)
2. **🔴 Issue #2** - Edge localStorage 경합 조건
3. **🟡 Issue #3** - 히스토리 메모리 제한
4. **🟡 Issue #4** - Edge z-index effect 삭제
5. **🟡 Issue #5** - ID 생성 개선
6. **🟢 Issue #6** - 임시저장 토스트
7. **🟢 Issue #7** - Edge 타입 검증

---

## 테스트 체크리스트

수정 후 다음을 테스트하세요:

- [ ] 노드 저장 시 모든 horizonNode가 올바르게 저장되는지 확인
- [ ] 페이지 새로고침 후 Edge가 복원되는지 확인
- [ ] 10분 이상 편집 후 브라우저 메모리 사용량 확인
- [ ] 노드/섹션/텍스트 빠르게 여러 번 추가 시 중복 ID 없는지 확인
- [ ] 임시저장 버튼 클릭 시 토스트 표시 확인
- [ ] 노드 연결 시 edge가 HorizonEdge 컴포넌트로 렌더링되는지 확인

---

**생성 일시:** 2025-01-20
**분석 범위:** `src/feature/roadmap/editor/`