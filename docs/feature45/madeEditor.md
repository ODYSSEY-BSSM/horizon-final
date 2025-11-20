# Horizon Roadmap Editor 구현 가이드

> Figma 디자인 기반 로드맵 에디터 Phase 1, 2 구현 문서

## 📋 목차
1. [개요](#개요)
2. [Figma 디자인 분석](#figma-디자인-분석)
3. [기존 구현 현황](#기존-구현-현황)
4. [Phase 1: 기본 에디터 동작](#phase-1-기본-에디터-동작)
5. [Phase 2: 연결 및 인터랙션](#phase-2-연결-및-인터랙션)
6. [구현 체크리스트](#구현-체크리스트)

---

## 개요

### 목표
Figma 디자인에 따라 **React Flow 기반 로드맵 에디터**를 구현합니다.

### 주요 기능
- 노드 생성 및 드래그 앤 드롭
- 노드 간 연결선 생성
- 섹션 크기 조절
- Undo/Redo 기능
- 선택된 요소 속성 편집

### 기술 스택
- **React Flow**: 캔버스 및 노드 관리
- **Zustand**: 에디터 상태 관리
- **Emotion**: 스타일링
- **TypeScript**: 타입 안정성

---

## Figma 디자인 분석

### 1. 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│ EditorHeader (상단)                          │
│ - Logo + "Roadmap Editor" 타이틀             │
│ - 임시저장, 저장하기 버튼                      │
└─────────────────────────────────────────────┘
┌────┬────────────────────────────────┬────────┐
│ H  │                                │  S     │
│ i  │                                │  i     │
│ s  │         Canvas                 │  d     │
│ t  │      (React Flow)              │  e     │
│ o  │                                │  b     │
│ r  │                                │  a     │
│ y  │                                │  r     │
│    │                                │        │
└────┴────────────────────────────────┴────────┘
┌─────────────────────────────────────────────┐
│ EditorToolbar (하단 중앙)                     │
│ [선택] [노드] [섹션] [텍스트] [AI]            │
└─────────────────────────────────────────────┘
```

### 2. 노드 타입

#### Title Node (제목 노드)
- 파란 배경
- 중앙 정렬 텍스트
- 4개 연결점 (상/하/좌/우)

#### Standard Node (기본 노드)
- 흰 배경 + 테두리
- 제목 + 설명 텍스트
- 진행도 바 (0-100%)
- 4개 연결점

#### Secondary Node (세부 노드)
- 흰 배경 + 테두리
- 제목 + 퀴즈 개수 (0/4)
- 학교 노드 변형: 🏫 아이콘 추가
- 4개 연결점

### 3. 섹션
- 큰 사각형 영역 (노드 그룹화)
- 파란 테두리 (선택 시 굵어짐)
- 드래그로 크기 조절 가능

### 4. 연결선 (Edges)
- 검은색 실선
- 노드의 연결점에서 드래그하여 생성
- Bezier curve 스타일

---

## 기존 구현 현황

### ✅ 완료된 컴포넌트

#### 1. 노드 컴포넌트
```typescript
// src/feature/roadmap/editor/components/nodes/HorizonNode/
- HorizonNode.tsx      // 통합 노드 컴포넌트
- TitleNode.tsx        // 제목 노드
- StandardNode.tsx     // 기본 노드
- SecondaryNode.tsx    // 세부 노드
```

#### 2. 레이아웃 컴포넌트
```typescript
// src/feature/roadmap/editor/components/layout/
- EditorHeader.tsx     // 상단 헤더
- EditorSidebar.tsx    // 우측 사이드바
```

#### 3. 툴바 컴포넌트
```typescript
// src/feature/roadmap/editor/components/toolbar/
- EditorToolbar.tsx    // 하단 툴바
- ToolbarItem.tsx      // 툴바 아이템
```

#### 4. UI 컴포넌트
```typescript
// src/feature/roadmap/editor/components/ui/
- HistoryController.tsx  // Undo/Redo 버튼
- EditorDropdown.tsx     // 드롭다운
- EditorTextbox.tsx      // 텍스트박스
- EditorTextfield.tsx    // 텍스트 필드
```

#### 5. 타입 정의
```typescript
// src/feature/roadmap/editor/types/
- node.types.ts        // 노드 타입
- section.types.ts     // 섹션 타입
- text.types.ts        // 텍스트 타입
```

### ❌ 누락된 구현

1. **React Flow 통합**
   - React Flow 인스턴스 설정
   - 노드 타입 등록
   - 캔버스 배경

2. **에디터 페이지**
   - 실제 에디터 페이지 라우트
   - 상태 관리

3. **인터랙션 로직**
   - 노드 추가 기능
   - 연결선 생성
   - 선택 상태 관리

4. **히스토리 관리**
   - Undo/Redo 스택

---

## Phase 1: 기본 에디터 동작

### 1.1 에디터 페이지 생성

**위치**: `src/app/(studio)/editor/page.tsx`

```typescript
import { EditorContent } from './content';

export default function RoadmapEditorPage() {
  return <EditorContent />;
}
```

**위치**: `src/app/(studio)/editor/content.tsx`

```typescript
'use client';

import { ReactFlowProvider } from 'reactflow';
import { RoadmapEditor } from '@/feature/roadmap/editor/RoadmapEditor';

export default function EditorContent() {
  return (
    <ReactFlowProvider>
      <RoadmapEditor />
    </ReactFlowProvider>
  );
}
```

### 1.2 React Flow 통합

**위치**: `src/feature/roadmap/editor/RoadmapEditor.tsx`

```typescript
'use client';

import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { HorizonNode } from './components/nodes/HorizonNode';
import { HorizonSection } from './components/nodes/HorizonSection';
import { HorizonText } from './components/nodes/HorizonText';
import { EditorHeader } from './components/layout/EditorHeader';
import { EditorSidebar } from './components/layout/EditorSidebar';
import { EditorToolbar } from './components/toolbar/EditorToolbar';
import { HistoryController } from './components/ui/HistoryController';

// 노드 타입 등록
const nodeTypes = {
  horizonNode: HorizonNode,
  horizonSection: HorizonSection,
  horizonText: HorizonText,
};

export const RoadmapEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 연결선 추가
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 헤더 */}
      <EditorHeader property="editing" />

      {/* 히스토리 컨트롤러 */}
      <div style={{ position: 'absolute', top: 84, left: 20, zIndex: 10 }}>
        <HistoryController canUndo={false} canRedo={false} />
      </div>

      {/* React Flow 캔버스 */}
      <div style={{ width: '100%', height: 'calc(100vh - 64px)', marginTop: 64 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* 사이드바 */}
      <div style={{ position: 'absolute', top: 64, right: 0, zIndex: 10 }}>
        <EditorSidebar nodeType="title" />
      </div>

      {/* 툴바 */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', zIndex: 10 }}>
        <EditorToolbar />
      </div>
    </div>
  );
};
```

### 1.3 노드 추가 기능

**위치**: `src/feature/roadmap/editor/hooks/useNodeCreator.ts`

```typescript
import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import type { NodeType, HorizonNodeData } from '../types/node.types';

export const useNodeCreator = () => {
  const { getNodes, setNodes } = useReactFlow();

  const addNode = useCallback(
    (type: NodeType, position = { x: 250, y: 250 }) => {
      const newNode = {
        id: `node-${Date.now()}`,
        type: 'horizonNode',
        position,
        data: createNodeData(type),
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return { addNode };
};

function createNodeData(type: NodeType): HorizonNodeData {
  switch (type) {
    case 'title':
      return {
        type: 'title',
        label: 'Title Node',
        color: 'blue',
      };
    case 'standard':
      return {
        type: 'standard',
        title: 'Standard Node',
        description: '노드의 학습 내용을 작성해주세요.',
        color: 'blue',
        progress: 0,
      };
    case 'secondary':
      return {
        type: 'secondary',
        title: 'Secondary Node',
        color: 'blue',
        quizCurrent: 0,
        quizTotal: 4,
      };
  }
}
```

### 1.4 선택 상태 관리

**위치**: `src/feature/roadmap/editor/stores/editorStore.ts`

```typescript
import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';

interface EditorState {
  selectedNodeId: string | null;
  selectedTool: string;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedTool: (tool: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedNodeId: null,
  selectedTool: 'selector',
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
}));
```

### 1.5 Handle 추가 (연결점)

**위치**: 각 노드 컴포넌트에 Handle 추가

```typescript
import { Handle, Position } from 'reactflow';

// TitleNode.tsx 예시
export const TitleNode = ({ data }: NodeProps<TitleNodeData>) => {
  return (
    <StyledContainer>
      {/* 상단 Handle */}
      <Handle type="source" position={Position.Top} id="top" />

      {/* 좌측 Handle */}
      <Handle type="source" position={Position.Left} id="left" />

      {/* 우측 Handle */}
      <Handle type="source" position={Position.Right} id="right" />

      {/* 하단 Handle */}
      <Handle type="source" position={Position.Bottom} id="bottom" />

      {/* 노드 내용 */}
      <StyledTitle $color={getNodeColor(data.color).primary}>
        {data.label}
      </StyledTitle>
    </StyledContainer>
  );
};
```

---

## Phase 2: 연결 및 인터랙션

### 2.1 연결선 드래그 앤 드롭

React Flow의 기본 기능 활용:
```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect} // 이미 Phase 1에서 구현
  nodeTypes={nodeTypes}
/>
```

### 2.2 커스텀 엣지 스타일

**위치**: `src/feature/roadmap/editor/components/edges/HorizonEdge.tsx`

```typescript
import { getBezierPath, type EdgeProps } from 'reactflow';
import { tokens } from '@/shared/tokens';

export const HorizonEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      stroke={tokens.colors.neutral[900]}
      strokeWidth={2}
      fill="none"
    />
  );
};
```

등록:
```typescript
const edgeTypes = {
  horizonEdge: HorizonEdge,
};

<ReactFlow edgeTypes={edgeTypes} defaultEdgeOptions={{ type: 'horizonEdge' }} />
```

### 2.3 섹션 크기 조절

**위치**: `src/feature/roadmap/editor/components/nodes/HorizonSection/HorizonSection.tsx`

```typescript
import { NodeResizer } from 'reactflow';

export const HorizonSection = ({ data, selected }: NodeProps<SectionNodeData>) => {
  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={100}
        color={tokens.colors.primary[500]}
      />
      <StyledContainer $borderColor={borderColor} $selected={selected}>
        {data.label && <StyledLabel>{data.label}</StyledLabel>}
      </StyledContainer>
    </>
  );
};
```

### 2.4 Undo/Redo 구현

**위치**: `src/feature/roadmap/editor/hooks/useHistory.ts`

```typescript
import { useState, useCallback } from 'react';
import type { Node, Edge } from 'reactflow';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveState = useCallback((nodes: Node[], edges: Edge[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, { nodes, edges }];
    });
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  return {
    saveState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};
```

---

## 구현 체크리스트

### Phase 1: 기본 에디터 동작
- [ ] 1.1 에디터 페이지 라우트 생성
- [ ] 1.2 React Flow 통합
- [ ] 1.3 노드 추가 기능 (useNodeCreator)
- [ ] 1.4 선택 상태 관리 (editorStore)
- [ ] 1.5 Handle 추가 (4방향 연결점)
- [ ] 1.6 툴바 ↔ 캔버스 연동
- [ ] 1.7 사이드바 ↔ 선택 노드 연동

### Phase 2: 연결 및 인터랙션
- [ ] 2.1 연결선 드래그 앤 드롭 테스트
- [ ] 2.2 커스텀 엣지 스타일 (HorizonEdge)
- [ ] 2.3 섹션 크기 조절 (NodeResizer)
- [ ] 2.4 Undo/Redo 구현 (useHistory)
- [ ] 2.5 연결선 삭제 기능
- [ ] 2.6 노드 삭제 기능
- [ ] 2.7 전체 통합 테스트

### 추가 개선 사항
- [ ] 그리드 스냅 기능
- [ ] 다중 선택
- [ ] 키보드 단축키 (Ctrl+Z, Ctrl+Y, Delete)
- [ ] 자동 저장
- [ ] 로딩 상태

---

## 참고 자료

### React Flow 공식 문서
- [Getting Started](https://reactflow.dev/learn)
- [Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [Custom Edges](https://reactflow.dev/learn/customization/custom-edges)
- [Node Resizer](https://reactflow.dev/api-reference/components/node-resizer)

### 프로젝트 내부 문서
- `docs/feature45/AboutHorizonNode.md` - 노드 컴포넌트 상세
- `docs/feature45/EditorComponents.md` - 에디터 컴포넌트 구조
- `docs/WEBSOCKET.md` - 실시간 협업 WebSocket

### Figma 디자인
- **Node ID**: `5820:16133` (Standard Tools 섹션)
- 주요 프레임: Frame 744, 772, 764