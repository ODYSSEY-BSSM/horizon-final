# Editor Components Documentation

React Flow 기반 로드맵 에디터를 위한 UI 컴포넌트 라이브러리입니다.

## 개요

이 문서는 `feature/studio` 모듈의 에디터 관련 컴포넌트들을 설명합니다. 모든 컴포넌트는 Emotion 스타일링을 사용하며, Figma 디자인을 정확히 구현했습니다.

## 구현된 컴포넌트

### 1. EditorHeader

에디터 상단의 헤더 컴포넌트로, 로드맵 제목과 저장 기능을 제공합니다.

#### 특징
- **3가지 상태**: editing, saved, saving
- **저장 기능**: 임시저장, 저장하기 버튼
- **상태 표시**: 저장됨 라벨, 저장중 표시

#### Props

```typescript
interface EditorHeaderProps {
  state?: 'editing' | 'saved' | 'saving';
  roadmapTitle?: string;
  onTempSave?: () => void;
  onSave?: () => void;
}
```

#### 사용 예시

```tsx
import { EditorHeader } from '@/feature/studio';

function Editor() {
  const [headerState, setHeaderState] = useState<'editing' | 'saved' | 'saving'>('editing');

  const handleTempSave = async () => {
    setHeaderState('saving');
    try {
      await saveTempRoadmap();
      setHeaderState('saved');
    } catch (error) {
      setHeaderState('editing');
    }
  };

  const handleSave = async () => {
    setHeaderState('saving');
    try {
      await saveRoadmap();
      setHeaderState('saved');
    } catch (error) {
      setHeaderState('editing');
    }
  };

  return (
    <EditorHeader
      state={headerState}
      roadmapTitle="나의 로드맵"
      onTempSave={handleTempSave}
      onSave={handleSave}
    />
  );
}
```

#### 디자인 사양
- **높이**: 64px 고정
- **배경**: 흰색 (#ffffff)
- **보더**: 하단 1px (#e3e8ef)
- **버튼 높이**: 40px
- **버튼 간격**: 10px

---

### 2. HistoryController

실행취소(Undo)와 재실행(Redo) 기능을 제공하는 컴포넌트입니다.

#### 특징
- **2개 버튼**: 실행취소, 재실행
- **상태 관리**: 각 버튼의 활성화/비활성화 상태
- **아이콘**: Material Symbols Rounded 사용

#### Props

```typescript
interface HistoryControllerProps {
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}
```

#### 사용 예시

```tsx
import { HistoryController } from '@/feature/studio';
import { useRoadmapHistory } from '@/feature/roadmap/hooks/useRoadmapHistory';

function EditorToolbar() {
  const { canUndo, canRedo, undo, redo } = useRoadmapHistory();

  return (
    <HistoryController
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={undo}
      onRedo={redo}
    />
  );
}
```

#### 디자인 사양
- **전체 크기**: 80px × 40px
- **버튼 크기**: 40px × 40px
- **보더**: 1px (#e3e8ef)
- **비활성화 색상**: #9aa4b2
- **활성화 색상**: #111827

---

### 3. EditorToast

성공/실패 알림을 표시하는 토스트 컴포넌트입니다.

#### 특징
- **2가지 타입**: success (성공), failed (실패)
- **2가지 레이아웃**: 제목만, 제목+설명
- **닫기 기능**: X 버튼
- **그림자 효과**: 부드러운 드롭 섀도우

#### Props

```typescript
interface EditorToastProps {
  title: string;
  description?: string;
  type?: 'success' | 'failed';
  onClose?: () => void;
}
```

#### 사용 예시

```tsx
import { EditorToast } from '@/feature/studio';
import { useState } from 'react';

function Editor() {
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    description?: string;
    type: 'success' | 'failed';
  }>({ show: false, title: '', type: 'success' });

  const showToast = (
    title: string,
    type: 'success' | 'failed',
    description?: string
  ) => {
    setToast({ show: true, title, description, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  return (
    <>
      {/* 에디터 내용 */}

      {toast.show && (
        <div style={{ position: 'fixed', top: 20, right: 20 }}>
          <EditorToast
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </div>
      )}
    </>
  );
}
```

#### 디자인 사양
- **너비**: 320px 고정
- **패딩**: 12px 20px
- **보더**: 왼쪽 3px 컬러 (success: #4a81f0, failed: #ff0000)
- **아이콘 크기**: 32px
- **그림자**: `0 4px 12px rgba(0, 0, 0, 0.1)`

---

## React Flow 노드 컴포넌트

### HorizonNode

로드맵의 메인 노드 컴포넌트로, 3가지 타입을 지원합니다.

#### 노드 타입

1. **TitleNode** (제목 노드)
   - 240px 너비
   - 컬러 배경
   - 중앙 정렬 텍스트 (24px ExtraBold)

2. **StandardNode** (표준 노드)
   - 248px 너비
   - 아이콘, 제목, 설명
   - 진행률 프로그레스 바

3. **SecondaryNode** (보조 노드)
   - 248px 너비
   - 아이콘, 제목
   - 문제 개수 표시 (예: "문제 3/10")

#### 공통 Props

```typescript
type NodeColor = 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'green';

interface TitleNodeData {
  type: 'title';
  label: string;
  color: NodeColor;
}

interface StandardNodeData {
  type: 'standard';
  title: string;
  description: string;
  color: NodeColor;
  progress: number; // 0-100
}

interface SecondaryNodeData {
  type: 'secondary';
  title: string;
  color: NodeColor;
  quizCurrent: number;
  quizTotal: number;
}
```

#### React Flow 사용 예시

```tsx
import ReactFlow, { Node } from 'reactflow';
import {
  TitleNode,
  StandardNode,
  SecondaryNode,
} from '@/feature/studio';

const nodeTypes = {
  horizonTitle: TitleNode,
  horizonStandard: StandardNode,
  horizonSecondary: SecondaryNode,
};

function RoadmapEditor() {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'horizonTitle',
      position: { x: 100, y: 100 },
      data: {
        type: 'title',
        label: 'React 학습',
        color: 'blue',
      },
    },
    {
      id: '2',
      type: 'horizonStandard',
      position: { x: 100, y: 200 },
      data: {
        type: 'standard',
        title: 'useState & useEffect',
        description: 'React의 기본 훅 학습',
        color: 'blue',
        progress: 75,
      },
    },
    {
      id: '3',
      type: 'horizonSecondary',
      position: { x: 100, y: 350 },
      data: {
        type: 'secondary',
        title: 'Quiz 풀기',
        color: 'purple',
        quizCurrent: 7,
        quizTotal: 10,
      },
    },
  ];

  return (
    <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
  );
}
```

#### 컬러 시스템

6가지 컬러 테마를 지원합니다:

| 컬러 | Primary | Background | Border | Progress Bar | Progress BG |
|------|---------|------------|--------|--------------|-------------|
| blue | #2666dc | #ffffff | #2666dc | #2666dc | #e8f0fe |
| red | #dc2626 | #ffffff | #dc2626 | #dc2626 | #fee2e2 |
| yellow | #eab308 | #ffffff | #eab308 | #eab308 | #fef9c3 |
| purple | #9333ea | #ffffff | #9333ea | #9333ea | #f3e8ff |
| orange | #f97316 | #ffffff | #f97316 | #f97316 | #ffedd5 |
| green | #16a34a | #ffffff | #16a34a | #16a34a | #dcfce7 |

---

### HorizonSection

노드들을 그룹핑하는 섹션 컴포넌트입니다 (React Flow의 Parent Node 기능 사용).

#### 특징
- **Parent Node 패턴**: 자식 노드를 포함하는 컨테이너
- **선택 상태**: 기본 2px 보더, 선택 시 4px 보더
- **크기 조절 가능**: 인라인 스타일로 width/height 지정

#### Props

```typescript
interface SectionNodeData {
  label?: string;
  color?: NodeColor;
}
```

#### 사용 예시

```tsx
import ReactFlow, { Node } from 'reactflow';
import { HorizonSection } from '@/feature/studio';

const nodeTypes = {
  horizonSection: HorizonSection,
  // ... 다른 노드 타입들
};

function RoadmapEditor() {
  const nodes: Node[] = [
    // Section (Parent Node)
    {
      id: 'section-1',
      type: 'horizonSection',
      position: { x: 0, y: 0 },
      data: {
        label: 'React 기초',
        color: 'blue',
      },
      style: { width: 600, height: 400 },
    },
    // Child nodes (섹션 내부에 포함됨)
    {
      id: 'node-1',
      type: 'horizonTitle',
      position: { x: 50, y: 50 }, // Section 기준 상대 위치
      data: { type: 'title', label: 'Hooks', color: 'blue' },
      parentNode: 'section-1', // 부모 섹션 지정
      extent: 'parent', // 섹션 내부로 이동 제한
    },
  ];

  return (
    <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
  );
}
```

#### 디자인 사양
- **기본 보더**: 2px (#6b7684)
- **선택 시 보더**: 4px (#4a81f0)
- **배경**: 흰색 (#ffffff)
- **권장 최소 크기**: 320px × 260px

---

### HorizonText

드래그 가능한 텍스트 노드 컴포넌트입니다.

#### 특징
- **2가지 타입**: title (제목), paragraph (본문)
- **드래그 가능**: React Flow 노드로 자유롭게 이동
- **선택 표시**: 선택 시 2px 파란색 보더

#### Props

```typescript
interface TextNodeData {
  text: string;
  type: 'title' | 'paragraph';
}
```

#### 사용 예시

```tsx
import ReactFlow, { Node } from 'reactflow';
import { HorizonText } from '@/feature/studio';

const nodeTypes = {
  horizonText: HorizonText,
};

function RoadmapEditor() {
  const nodes: Node[] = [
    {
      id: 'text-1',
      type: 'horizonText',
      position: { x: 100, y: 50 },
      data: {
        text: 'React 학습 로드맵',
        type: 'title',
      },
    },
    {
      id: 'text-2',
      type: 'horizonText',
      position: { x: 100, y: 100 },
      data: {
        text: '이 로드맵은 React를 처음 시작하는 분들을 위한 가이드입니다.',
        type: 'paragraph',
      },
    },
  ];

  return (
    <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
  );
}
```

#### 디자인 사양

**Title 타입**:
- 폰트 크기: 20px
- 폰트 굵기: Bold (700)
- 색상: #111827

**Paragraph 타입**:
- 폰트 크기: 16px
- 폰트 굵기: Regular (400)
- 색상: #4b5563

**선택 상태**:
- 보더: 2px solid #4a81f0

---

## 통합 사용 예시

### 완전한 에디터 구성

```tsx
import { useState } from 'react';
import ReactFlow, { Node, Edge, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import {
  EditorHeader,
  HistoryController,
  EditorToast,
  TitleNode,
  StandardNode,
  SecondaryNode,
  HorizonSection,
  HorizonText,
} from '@/feature/studio';

const nodeTypes = {
  horizonTitle: TitleNode,
  horizonStandard: StandardNode,
  horizonSecondary: SecondaryNode,
  horizonSection: HorizonSection,
  horizonText: HorizonText,
};

export default function RoadmapEditor() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [headerState, setHeaderState] = useState<'editing' | 'saved' | 'saving'>('editing');
  const [toast, setToast] = useState({ show: false, title: '', type: 'success' as const });

  const handleSave = async () => {
    setHeaderState('saving');
    try {
      // 저장 로직
      await saveRoadmap(nodes, edges);
      setHeaderState('saved');
      setToast({ show: true, title: '저장되었습니다', type: 'success' });
    } catch (error) {
      setHeaderState('editing');
      setToast({ show: true, title: '저장 실패', type: 'failed' });
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <EditorHeader
        state={headerState}
        roadmapTitle="나의 로드맵"
        onTempSave={handleSave}
        onSave={handleSave}
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={(changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
            setHeaderState('editing');
          }}
          onEdgesChange={(changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
            setHeaderState('editing');
          }}
        >
          <Controls />
          <Background />
        </ReactFlow>

        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <HistoryController
            canUndo={false}
            canRedo={false}
            onUndo={() => {}}
            onRedo={() => {}}
          />
        </div>
      </div>

      {toast.show && (
        <div style={{ position: 'fixed', top: 20, right: 20 }}>
          <EditorToast
            title={toast.title}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </div>
      )}
    </div>
  );
}
```

---

## 스타일링 가이드

### Design Tokens 사용

모든 컴포넌트는 `@/shared/tokens`의 디자인 토큰을 사용합니다:

```typescript
import { tokens } from '@/shared/tokens';

// 색상
tokens.colors.primary // #4a81f0
tokens.colors.white // #ffffff
tokens.colors.neutral[900] // #111827
tokens.colors.neutral[500] // #6b7684
tokens.colors.neutral[200] // #e3e8ef

// 간격
tokens.spacing.xs // 4px
tokens.spacing.sm // 8px
tokens.spacing.md // 12px
tokens.spacing.lg // 20px

// 반경
tokens.radius.xs // 4px
tokens.radius.sm // 6px
tokens.radius.md // 8px

// 타이포그래피
tokens.typography.fontFamily.suit
tokens.typography.fontWeight.regular // 400
tokens.typography.fontWeight.semiBold // 600
tokens.typography.fontWeight.bold // 700
```

### Material Symbols Rounded 아이콘

아이콘 사용 시 일관된 스타일을 적용하세요:

```tsx
<span className="material-symbols-rounded">
  icon_name
</span>

// 스타일링
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

---

## 다음 단계

구현 예정인 컴포넌트:

1. **Toolbar** - 노드 추가, 줌 컨트롤, 도구 모음
2. **Sidebar** - 선택된 노드 속성 편집
3. **Editor** - React Flow 통합 메인 에디터
4. **ColorDropdown** - 색상 선택 드롭다운
5. **Textbox/TextField** - 텍스트 입력 컴포넌트

---

## 참고 자료

- [React Flow 공식 문서](https://reactflow.dev/)
- [Emotion 공식 문서](https://emotion.sh/)
- [Material Symbols](https://fonts.google.com/icons)
- [프로젝트 아키텍처 문서](../architecture/README.md)
- [HorizonNode 상세 문서](./AboutHorizonNode.md)
