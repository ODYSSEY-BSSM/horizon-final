# 로드맵 에디터 - 오늘 작업 내역 & 다음 할 일

**작성일**: 2025-11-19
**작업 범위**: `feature/roadmap/editor` 에디터 구현

---

## ✅ 오늘 완료한 작업 (2025-11-19)

### 1. 🔴 Critical 버그 수정 완료

#### 1.1 EditorTextbox - focus border-color 수정
**파일**: `src/feature/roadmap/editor/components/ui/EditorTextbox/EditorTextbox.tsx:83`

```typescript
// ❌ 수정 전
border-color: ${tokens.colors.primary};  // 객체 참조 오류

// ✅ 수정 후
border-color: ${tokens.colors.primary[500]};  // 올바른 색상 값
```

**결과**: 인풋 포커스 시 파란색 테두리가 정상 표시됨

---

#### 1.2 EditorDropdown - focus border-color 수정
**파일**: `src/feature/roadmap/editor/components/ui/EditorDropdown/EditorDropdown.tsx:109`

```typescript
// ❌ 수정 전
border-color: ${tokens.colors.primary};

// ✅ 수정 후
border-color: ${tokens.colors.primary[500]};
```

**결과**: 드롭다운 포커스 시 테두리 색상 정상 표시

---

#### 1.3 useNodeCreator - addText 타입 불일치 수정
**파일**: `src/feature/roadmap/editor/hooks/useNodeCreator.ts:59-64`

```typescript
// ❌ 수정 전
const addText = useCallback(
  (textType: 'title' | 'subtitle' | 'body' = 'body', ...) => {
    data: { type: textType, content: 'New Text' },  // content 필드 (잘못됨)
  }
);

// ✅ 수정 후
const addText = useCallback(
  (textType: 'title' | 'paragraph' = 'paragraph', ...) => {
    data: { type: textType, text: 'New Text' },  // text 필드 (올바름)
  }
);
```

**근거**: `TextNodeData` 타입 정의에 맞춰 수정
- 타입: `'title' | 'paragraph'`
- 필드명: `text` (not `content`)

**결과**: 텍스트 노드 생성 시 타입 오류 해결

---

### 2. 🎨 Icon 컴포넌트 적용 완료

기존 `<span className="material-symbols-rounded">` 하드코딩을 `<Icon>` 컴포넌트로 교체

#### 2.1 StandardNode
**파일**: `src/feature/roadmap/editor/components/nodes/HorizonNode/StandardNode.tsx`

```typescript
// ❌ 수정 전
<StyledIcon $color={colorTheme.primary}>school</StyledIcon>

// ✅ 수정 후
<Icon name="school" size={24} color={colorTheme.primary} filled />
```

- `StyledIcon` 스타일 컴포넌트 제거
- Material Symbols 설정 자동 적용

---

#### 2.2 SecondaryNode
**파일**: `src/feature/roadmap/editor/components/nodes/HorizonNode/SecondaryNode.tsx`

```typescript
// ❌ 수정 전
<StyledIcon $color={colorTheme.primary}>school</StyledIcon>

// ✅ 수정 후
<Icon name="school" size={24} color={colorTheme.primary} filled />
```

- `StyledIcon` 스타일 컴포넌트 제거
- 일관된 아이콘 렌더링

---

#### 2.3 EditorSidebar
**파일**: `src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx`

```typescript
// ❌ 수정 전 (2곳)
<StyledSchoolIcon className="material-symbols-rounded">school</StyledSchoolIcon>

// ✅ 수정 후
<Icon name="school" size={24} color="#2666dc" filled />
```

- Standard/Secondary 학교 노드 헤더 2곳 모두 수정
- `StyledSchoolIcon` 스타일 컴포넌트 제거

**장점**:
- 코드 중복 제거
- 일관된 아이콘 시스템 사용
- Material Symbols 설정 자동 관리
- 타입 안전성 확보

---

## 📊 버그 추적 완료 (전체 리스트)

### 🔴 Critical (완료)
1. ✅ EditorTextbox focus border-color
2. ✅ EditorDropdown focus border-color
3. ✅ useNodeCreator addText 타입 불일치

### 🟡 Medium (미완료 - 다음 단계)
4. ⏳ EditorSidebar onChange 핸들러 누락
5. ⏳ RoadmapEditor 선택된 노드 데이터 전달 안 함
6. ⏳ EditorToolbar 콜백 optional → 필수 변경

### 🟢 Minor (미완료 - 개선 사항)
7. ⏳ StandardNode/SecondaryNode 아이콘 조건부 렌더링 (`isSchoolNode` prop)
8. ⏳ Text 노드 타입 불일치 (HorizonText vs EditorSidebar)
9. ⏳ EditorDropdown 외부 클릭 시 닫기 기능
10. ⏳ fontFamily 타입 일관성 확인

---

## 🎯 다음 할 일 (우선순위순)

### Priority 1: 에디터 핵심 동작 연결 (필수)

#### 1️⃣ EditorSidebar ↔ 선택된 노드 동적 연동 (30분 예상)

**목표**: 노드 클릭 시 → 사이드바가 해당 노드 타입에 맞는 UI로 자동 변경

**현재 상태**:
```typescript
// RoadmapEditor.tsx:205
<EditorSidebar nodeType="secondary" />  // ❌ 하드코딩
```

**수정 방법**:
```typescript
// RoadmapEditor.tsx
const selectedNode = nodes.find((node) => node.id === selectedNodeId);

<EditorSidebar
  nodeType={selectedNode?.data.type || 'title'}  // ✅ 동적
  nodeData={selectedNode?.data}
  onNodeUpdate={handleNodeUpdate}
/>
```

**변경 파일**:
- `src/feature/roadmap/editor/RoadmapEditor.tsx`
- `src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx`

**테스트 방법**:
1. Title 노드 클릭 → 사이드바 "Title Node" 표시
2. Standard 노드 클릭 → 사이드바 "Standard Node" 표시
3. Secondary 노드 클릭 → 사이드바 "Secondary Node" 표시

---

#### 2️⃣ 사이드바 입력 → 노드 데이터 실시간 반영 (1시간 예상)

**목표**: 제목/색상/설명 변경 시 → 즉시 캔버스 노드에 반영

**필요 작업**:

1. **EditorSidebar props 추가**:
```typescript
export interface EditorSidebarProps {
  nodeType: EditorNodeType;
  nodeData?: any;  // 👈 추가: 현재 노드 데이터
  onNodeUpdate?: (field: string, value: any) => void;  // 👈 추가: 업데이트 콜백
  isSchoolNode?: boolean;
  onSchoolNodeToggle?: () => void;
}
```

2. **RoadmapEditor에 업데이트 핸들러 구현**:
```typescript
const handleNodeUpdate = useCallback((field: string, value: any) => {
  if (!selectedNodeId) return;

  setNodes((nds) =>
    nds.map((node) =>
      node.id === selectedNodeId
        ? { ...node, data: { ...node.data, [field]: value } }
        : node
    )
  );
}, [selectedNodeId, setNodes]);
```

3. **EditorSidebar에 onChange 연결**:
```typescript
<EditorTextbox
  label="이름"
  value={nodeData?.title || ''}
  onChange={(newTitle) => onNodeUpdate?.('title', newTitle)}
/>

<EditorTextfield
  label="학습 내용"
  value={nodeData?.description || ''}
  onChange={(newDesc) => onNodeUpdate?.('description', newDesc)}
/>

<ColorDropdown
  value={nodeData?.color || 'blue'}
  onChange={(newColor) => onNodeUpdate?.('color', newColor)}
/>
```

**변경 파일**:
- `src/feature/roadmap/editor/RoadmapEditor.tsx`
- `src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx`

**테스트 방법**:
1. 노드 선택 후 사이드바에서 제목 변경 → 캔버스 노드 제목 즉시 변경
2. 색상 변경 → 노드 테두리 색상 즉시 변경
3. 설명 변경 → Standard 노드 설명 즉시 변경

---

#### 3️⃣ 툴바 → 캔버스 노드 추가 기능 (30분 예상)

**목표**: 툴바 "노드" 버튼 클릭 → 캔버스에 새 노드 생성

**필요 작업**:

1. **RoadmapEditor에서 useNodeCreator 사용**:
```typescript
const { addNode, addSection, addText } = useNodeCreator();

const handleNodeTypeSelect = useCallback((nodeType: string) => {
  if (nodeType === 'title') {
    addNode('title', { x: 250, y: 250 });
  } else if (nodeType === 'standard') {
    addNode('standard', { x: 250, y: 250 });
  } else if (nodeType === 'secondary') {
    addNode('secondary', { x: 250, y: 250 });
  }
}, [addNode]);
```

2. **EditorToolbar에 콜백 전달**:
```typescript
<EditorToolbar
  selectedTool={selectedTool}
  onToolSelect={setSelectedTool}
  onNodeTypeSelect={handleNodeTypeSelect}
  onTextTypeSelect={handleTextTypeSelect}
  onAiActionSelect={handleAiActionSelect}
/>
```

**변경 파일**:
- `src/feature/roadmap/editor/RoadmapEditor.tsx`

**테스트 방법**:
1. 툴바 "노드" 버튼 클릭 → 드롭다운 열림
2. "제목 노드" 선택 → Title 노드 생성
3. "기본 노드" 선택 → Standard 노드 생성
4. "하위 노드" 선택 → Secondary 노드 생성

---

#### 4️⃣ Section과 Text 노드 툴바 연결 (30분 예상)

**목표**: 섹션/텍스트 버튼 클릭 시 해당 노드 생성

**필요 작업**:

```typescript
const handleSectionSelect = useCallback(() => {
  addSection({ x: 100, y: 100 }, { width: 600, height: 400 });
}, [addSection]);

const handleTextTypeSelect = useCallback((textType: string) => {
  if (textType === 'title-text') {
    addText('title', { x: 250, y: 250 });
  } else if (textType === 'paragraph-text') {
    addText('paragraph', { x: 250, y: 250 });
  }
}, [addText]);
```

**테스트 방법**:
1. 툴바 "섹션" 버튼 클릭 → 섹션 생성
2. 툴바 "텍스트" 버튼 → "제목 텍스트" 선택 → 제목 텍스트 생성
3. "본문 텍스트" 선택 → 본문 텍스트 생성

---

### Priority 2: 백엔드 연결 (중요)

#### 5️⃣ 로드맵 데이터 로드 (초기화)
- URL 파라미터에서 roadmapId 가져오기
- `realRoadmapApi.getRoadmap()` 호출
- `realNodeApi.getNodes()` 호출
- React Flow 노드 형식으로 변환

#### 6️⃣ 노드 CRUD API 연결
- 노드 생성: `realNodeApi.createNode()`
- 노드 수정: `realNodeApi.updateNode()`
- 노드 삭제: `realNodeApi.deleteNode()`

#### 7️⃣ WebSocket 실시간 동기화
- `useRoadmapNodesWebSocket` 연결
- 노드 생성/수정/삭제 이벤트 수신

---

## 📝 참고 사항

### 구현된 API (모두 준비 완료)
- ✅ REST API: `realNodeApi`, `realRoadmapApi`
- ✅ WebSocket: `useRoadmapNodesWebSocket`, `useCursorWebSocket`
- ✅ 문서: `docs/WEBSOCKET.md`, `docs/TODO_EDITOR.md`

### 현재 에디터 상태
- ✅ UI 컴포넌트: 모두 구현됨
- ✅ React Flow 통합: 완료
- ✅ 노드 타입: Title, Standard, Secondary, Section, Text
- ✅ 히스토리 관리: useHistory hook
- ⏳ 데이터 연결: 미완료 (다음 단계)

### 예상 소요 시간
- Priority 1 (핵심 동작): **2-3시간**
- Priority 2 (백엔드 연결): **3-4시간**
- **총 예상 시간**: 5-7시간

---

## 🔧 유용한 명령어

### 개발 서버 실행
```bash
bun dev
```

### 린트 & 포맷팅
```bash
bun lint          # 체크만
bun run lint:fix  # 자동 수정
```

### Storybook
```bash
bun run storybook
```

---

**다음 세션 시작 시**: Priority 1의 1️⃣번부터 시작하면 됩니다! 🚀
