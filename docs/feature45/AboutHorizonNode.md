# HorizonNode - Dynamic Roadmap Editor Components

## 📋 Overview

**HorizonNode**는 Horizon 프로젝트의 동적 로드맵 에디터를 위한 React Flow 기반 커스텀 노드 컴포넌트입니다. 사용자가 시각적으로 로드맵을 생성하고 편집할 수 있도록 인터랙티브한 노드 인터페이스를 제공합니다.

## 🎯 Feature Information

- **Feature Name**: `studio`
- **Location**: `src/feature/studio/`
- **Route Group**: `(studio)`
- **Pages**: `/editor/[roadmapId]`, `/viewer/[roadmapId]`
- **Issue**: #45

## 🏗️ Architecture

### Directory Structure

```
src/
├── feature/
│   └── studio/
│       ├── components/
│       │   └── HorizonNode/
│       │       ├── index.ts                 # Public API exports
│       │       ├── HorizonNode.tsx          # Main node component
│       │       ├── TitleNode.tsx            # Title variant
│       │       ├── StandardNode.tsx         # Standard variant with progress
│       │       └── SecondaryNode.tsx        # Secondary variant with quiz count
│       ├── constants/
│       │   ├── nodeColors.ts                # Color theme constants
│       │   └── nodeTypes.ts                 # Node type definitions
│       ├── types/
│       │   ├── node.types.ts                # Node data types
│       │   └── flow.types.ts                # React Flow types
│       ├── hooks/
│       │   ├── useFlowEditor.ts             # Editor state management
│       │   └── useRoadmapNodes.ts           # Node CRUD operations
│       ├── stores/
│       │   └── studioStore.ts               # Zustand store for studio
│       └── index.ts                         # Feature public API
│
└── app/
    └── (studio)/
        ├── editor/
        │   └── [roadmapId]/
        │       ├── page.tsx
        │       └── content.tsx
        └── viewer/
            └── [roadmapId]/
                ├── page.tsx
                └── content.tsx
```

## 🎨 Node Types

HorizonNode는 3가지 타입의 노드를 지원합니다:

### 1. Title Node
![Title Node](screenshots/title-node.png)

**용도**: 로드맵의 주요 섹션 제목
**특징**:
- 큰 배경색 블록
- 중앙 정렬된 텍스트
- 24px ExtraBold 폰트
- 상/하/좌/우 연결점 (Handle)

**Props**:
```typescript
{
  type: 'title',
  color: 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'green',
  data: {
    title: string;
  }
}
```

### 2. Standard Node
![Standard Node](screenshots/standard-node.png)

**용도**: 학습 콘텐츠 노드 (진행도 포함)
**특징**:
- School 아이콘 (Material Symbols Rounded)
- 노드 제목 + 설명
- 진행도 바 (Progress Bar)
- 상/하/좌/우 연결점

**Props**:
```typescript
{
  type: 'standard',
  color: 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'green',
  isSchoolNode: boolean,
  hasSecondaryNode: boolean,
  data: {
    title: string;
    description: string;
    progress: number; // 0-100
  }
}
```

### 3. Secondary Node
![Secondary Node](screenshots/secondary-node.png)

**용도**: 퀴즈/문제 노드
**특징**:
- School 아이콘
- 노드 제목
- 문제 개수 표시 (예: "문제 0/4")
- 상/하/좌/우 연결점

**Props**:
```typescript
{
  type: 'secondary',
  color: 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'green',
  isSchoolNode: boolean,
  data: {
    title: string;
    solvedCount: number;
    totalCount: number;
  }
}
```

## 🎨 Color Themes

HorizonNode는 6가지 색상 테마를 지원합니다:

| Color | Primary | Background | Usage |
|-------|---------|------------|-------|
| `blue` | `#2666dc` | `#eaf0fb` | 기본, 기초 학습 |
| `red` | TBD | TBD | 중요, 필수 학습 |
| `yellow` | TBD | TBD | 주의, 복습 필요 |
| `purple` | TBD | TBD | 심화, 고급 학습 |
| `orange` | TBD | TBD | 실습, 프로젝트 |
| `green` | TBD | TBD | 완료, 성공 |

## 🔌 React Flow Integration

### Node Type Registration

```typescript
import ReactFlow from 'reactflow';
import { HorizonNode } from '@/feature/studio';

const nodeTypes = {
  horizon: HorizonNode,
};

function StudioEditor() {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
    />
  );
}
```

### Node Data Structure

```typescript
const nodes = [
  {
    id: '1',
    type: 'horizon',
    position: { x: 100, y: 100 },
    data: {
      nodeType: 'title',
      color: 'blue',
      title: 'Introduction',
    },
  },
  {
    id: '2',
    type: 'horizon',
    position: { x: 100, y: 200 },
    data: {
      nodeType: 'standard',
      color: 'blue',
      isSchoolNode: true,
      title: '기본 개념',
      description: '프로그래밍 기초를 학습합니다.',
      progress: 50,
    },
  },
  {
    id: '3',
    type: 'horizon',
    position: { x: 100, y: 400 },
    data: {
      nodeType: 'secondary',
      color: 'blue',
      isSchoolNode: true,
      title: '연습 문제',
      solvedCount: 2,
      totalCount: 4,
    },
  },
];
```

## 🎯 Handle (Connection Points)

모든 HorizonNode는 4방향 연결점을 가집니다:

```typescript
<Handle type="target" position={Position.Top} id="top" />
<Handle type="source" position={Position.Bottom} id="bottom" />
<Handle type="source" position={Position.Right} id="right" />
<Handle type="target" position={Position.Left} id="left" />
```

- **Top/Left**: `target` (입력 연결점)
- **Bottom/Right**: `source` (출력 연결점)

## 💅 Styling

### Technology Stack
- **CSS-in-JS**: `@emotion/styled`
- **Design Tokens**: `src/shared/tokens/`
- **Typography**: SUIT Variable 폰트
- **Icons**: Material Symbols Rounded

### Design Tokens Usage

```typescript
import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

const StyledNode = styled.div`
  background: ${tokens.colors.white};
  border: 2px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.md};
  padding: ${tokens.spacing.lg};
`;
```

### Typography Mapping

| Element | Figma Style | CSS |
|---------|-------------|-----|
| Title Node Text | Header/H2_EB_24 | `font-size: 24px; font-weight: 800; line-height: 34px` |
| Node Title | Subtitle/ST_SB_18 | `font-size: 18px; font-weight: 600; line-height: 26px` |
| Node Description | Body/B2_R_14 | `font-size: 14px; font-weight: 300; line-height: 22px` |
| Progress Label | Caption/C_M_12 | `font-size: 12px; font-weight: 500; line-height: 18px` |
| Secondary Text | Body/B1_R_16 | `font-size: 16px; font-weight: 400; line-height: 24px` |

## 📦 Dependencies

```json
{
  "reactflow": "^11.x.x"
}
```

**Installation**:
```bash
bun add reactflow
```

## 🔄 State Management

### Zustand Store (studioStore.ts)

```typescript
interface StudioState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;

  // Actions
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
}
```

## 🌐 WebSocket Integration

실시간 협업을 위한 WebSocket 통신:

```typescript
// feature/studio/hooks/useNodeWebSocket.ts
import { useWebSocket } from '@/shared/hooks';

export function useNodeWebSocket(roadmapId: string) {
  const { subscribe, publish } = useWebSocket();

  useEffect(() => {
    // 노드 변경 구독
    subscribe(`/topic/roadmap/${roadmapId}/nodes`, (message) => {
      // 노드 업데이트 처리
    });
  }, [roadmapId]);

  const updateNodePosition = (nodeId: string, position: XYPosition) => {
    publish(`/app/roadmap/${roadmapId}/node/move`, {
      nodeId,
      position,
    });
  };

  return { updateNodePosition };
}
```

## 🎭 Mode: Editor vs Viewer

### Editor Mode
- 노드 드래그 가능
- 노드 편집/삭제 가능
- 연결선 추가/제거 가능
- 툴바 표시

### Viewer Mode
- 읽기 전용
- 노드 클릭 시 상세 정보 표시
- 줌/팬 가능
- 툴바 숨김

```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodesDraggable={mode === 'editor'}
  edgesUpdatable={mode === 'editor'}
  nodeTypes={nodeTypes}
/>
```

## 📱 Responsive Design

HorizonNode는 고정 너비를 사용합니다:
- **Title Node**: `240px`
- **Standard Node**: `240px` (content width: `200px`)
- **Secondary Node**: `240px` (content width: `200px`)

캔버스는 줌/팬으로 모바일 대응:
```typescript
<ReactFlow
  minZoom={0.5}
  maxZoom={2}
  defaultViewport={{ x: 0, y: 0, zoom: 1 }}
/>
```

## 🧪 Testing Considerations

### Unit Tests
- 각 노드 타입별 렌더링 테스트
- Props 변경 시 올바른 스타일 적용 확인
- Handle 위치 검증

### Integration Tests
- React Flow 연동 테스트
- 노드 추가/삭제/이동 시나리오
- WebSocket 메시지 처리

### E2E Tests (Playwright)
- 에디터 페이지 로드
- 노드 드래그 앤 드롭
- 연결선 생성
- 저장 기능

## 🚀 Implementation Roadmap

### Phase 1: Core Components (Week 1)
- [ ] HorizonNode 메인 컴포넌트 구현
- [ ] TitleNode, StandardNode, SecondaryNode 구현
- [ ] 색상 테마 constants 생성
- [ ] TypeScript 타입 정의

### Phase 2: React Flow Integration (Week 2)
- [ ] FlowCanvas 래퍼 컴포넌트
- [ ] 노드 추가/삭제/편집 기능
- [ ] 연결선 관리
- [ ] Zustand 스토어 구현

### Phase 3: Editor/Viewer Pages (Week 3)
- [ ] `/editor/[roadmapId]` 페이지 구현
- [ ] `/viewer/[roadmapId]` 페이지 구현
- [ ] 툴바 컴포넌트
- [ ] 저장/불러오기 API 연동

### Phase 4: Real-time Collaboration (Week 4)
- [ ] WebSocket 연동
- [ ] 실시간 노드 위치 동기화
- [ ] 다중 사용자 커서 표시
- [ ] 충돌 방지 로직

## 📚 Related Documentation

- [React Flow Official Docs](https://reactflow.dev/)
- [Emotion Styled Components](https://emotion.sh/docs/styled)
- [Feature-Sliced Design](../../architecture/README.md)
- [WebSocket API](../WEBSOCKET.md)
- [Design Tokens](../../shared/tokens/README.md)

## 🤝 Contributing

HorizonNode 개발 시 주의사항:

1. **Feature-based Architecture 준수**
   - `feature/studio/index.ts`를 통해 public API만 export
   - 외부에서는 `@/feature/studio`로만 import

2. **Design Tokens 사용**
   - 하드코딩된 색상/간격 금지
   - `tokens` 사용 필수

3. **TypeScript 엄격 모드**
   - 모든 props에 타입 정의
   - `any` 사용 금지

4. **Emotion Styled Components**
   - Tailwind 사용 금지
   - `styled` 함수 사용

5. **Accessibility**
   - 키보드 네비게이션 지원
   - ARIA 속성 추가
   - 색상 대비 준수

## 📝 License

이 문서는 Horizon 프로젝트의 일부입니다.

---

**Last Updated**: 2025-01-17
**Author**: Horizon Team
**Issue**: #45
