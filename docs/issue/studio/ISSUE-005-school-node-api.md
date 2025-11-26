# ISSUE-005: 학교 노드 전환 API 미연동

## 개요
| 항목 | 내용 |
|------|------|
| **심각도** | 🟡 Major |
| **영향 범위** | Editor |
| **관련 파일** | `src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx` |
| **상태** | Open |

## 문제 설명

EditorSidebar에서 노드를 "학교 노드"로 전환하는 기능이 있지만, 실제 API 호출 없이 로컬 상태만 변경하고 있습니다. 학교 노드는 교육 과정과 연결되어 학교 학습 내용과 로드맵을 연동하는 중요한 기능입니다.

## 현재 구현 상태

### EditorSidebar.tsx
**위치**: `EditorSidebar.tsx:86-97`

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

**문제점**:
- `_curriculumId` 파라미터가 사용되지 않음 (underscore prefix는 미사용 변수 표시)
- 실제 API 호출 대신 `setTimeout`으로 가짜 비동기 처리
- 로컬 상태만 변경되고 서버에는 반영 안 됨

### 관련 모달
```typescript
<SchoolNodeToggleModal
  isOpen={isToggleModalOpen}
  onClose={() => setIsToggleModalOpen(false)}
  isSchoolNode={isSchoolNode}
  nodeTitle={nodeTitle}
  onConfirm={handleToggleConfirm}
/>
```

## 문제점

### 1. 데이터 불일치
- 로컬에서는 학교 노드로 표시되지만 서버에는 반영 안 됨
- 페이지 새로고침 시 학교 노드 설정 초기화
- 다른 사용자에게 학교 노드로 표시되지 않음

### 2. 교육 과정 연동 불가
- 선택된 교육 과정 ID(`curriculumId`)가 저장되지 않음
- 학교 학습 내용과의 연결 정보 손실
- 교육 과정 기반 기능 작동 불가

### 3. 기능 미완성
- 학교 노드 전환의 핵심 목적인 교육 과정 연결이 작동하지 않음
- UI만 변경되고 실제 기능은 없음

## 학교 노드 기능 설명

### 목적
- 로드맵의 노드를 학교 교육 과정과 연결
- 학교에서 배우는 내용과 자기주도 학습 내용 통합
- 학습 경로에서 학교 학습 부분 시각적 구분

### 기대 동작
1. 사용자가 노드 선택 후 "학교 노드로 전환" 클릭
2. 교육 과정 선택 모달 표시
3. 적절한 교육 과정 항목 선택
4. 노드가 학교 노드로 변환되고 교육 과정 정보 연결
5. 서버에 변경사항 저장
6. 다른 사용자도 학교 노드로 확인 가능

## 해결 방안

### 1. 노드 API 확장

현재 노드 업데이트 API에 학교 노드 관련 필드 추가:

```typescript
interface NodeUpdateRequest {
  // 기존 필드...
  positionX?: number;
  positionY?: number;
  title?: string;
  // 학교 노드 관련 필드 추가
  isSchoolNode?: boolean;
  curriculumId?: string;
}
```

또는 별도의 엔드포인트:

```
POST /roadmap/{roadmapId}/nodes/{nodeId}/convert-to-school
{
  "curriculumId": "string",
  "isSchoolNode": true
}

POST /roadmap/{roadmapId}/nodes/{nodeId}/convert-from-school
{
  "isSchoolNode": false
}
```

### 2. API 클라이언트 구현

```typescript
// src/feature/roadmap/editor/api/nodeApi.ts에 추가

export async function convertToSchoolNode(
  roadmapId: number,
  nodeId: number,
  curriculumId: string
): Promise<NodeResponse> {
  const response = await apiClient.post<ApiResponse<NodeResponse>>(
    `/roadmap/${roadmapId}/nodes/${nodeId}/convert-to-school`,
    { curriculumId, isSchoolNode: true }
  );
  return response.data.data;
}

export async function convertFromSchoolNode(
  roadmapId: number,
  nodeId: number
): Promise<NodeResponse> {
  const response = await apiClient.post<ApiResponse<NodeResponse>>(
    `/roadmap/${roadmapId}/nodes/${nodeId}/convert-from-school`,
    { isSchoolNode: false }
  );
  return response.data.data;
}
```

### 3. TanStack Query 훅

```typescript
// src/feature/roadmap/editor/hooks/useSchoolNodeMutation.ts

export function useConvertToSchoolNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, curriculumId }: { nodeId: number; curriculumId: string }) =>
      convertToSchoolNode(roadmapId, nodeId, curriculumId),
    onMutate: async ({ nodeId }) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ['nodes', roadmapId] });
      const previous = queryClient.getQueryData(['nodes', roadmapId]);

      queryClient.setQueryData(['nodes', roadmapId], (old: NodeResponse[]) =>
        old.map(node =>
          node.id === nodeId
            ? { ...node, isSchoolNode: true }
            : node
        )
      );

      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['nodes', roadmapId], context?.previous);
      // 에러 토스트 표시
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes', roadmapId] });
    },
  });
}

export function useConvertFromSchoolNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nodeId: number) =>
      convertFromSchoolNode(roadmapId, nodeId),
    // ... 유사한 낙관적 업데이트 로직
  });
}
```

### 4. handleToggleConfirm 수정

```typescript
// EditorSidebar.tsx

const convertToSchoolMutation = useConvertToSchoolNode(roadmapId);
const convertFromSchoolMutation = useConvertFromSchoolNode(roadmapId);

const handleToggleConfirm = async (curriculumId: string) => {
  if (!selectedNodeId) return;

  setIsConverting(true);

  try {
    if (!isSchoolNode) {
      // 학교 노드로 전환
      await convertToSchoolMutation.mutateAsync({
        nodeId: Number(selectedNodeId),
        curriculumId,
      });
    } else {
      // 일반 노드로 전환
      await convertFromSchoolMutation.mutateAsync(Number(selectedNodeId));
    }

    // 로컬 상태도 업데이트 (캔버스 즉시 반영용)
    onNodeUpdate?.('isSchoolNode', !isSchoolNode);
    if (!isSchoolNode) {
      onNodeUpdate?.('curriculumId', curriculumId);
    }

    setIsToggleModalOpen(false);
  } catch (error) {
    console.error('Failed to convert node:', error);
    // 에러 토스트 표시
  } finally {
    setIsConverting(false);
  }
};
```

### 5. 노드 데이터 구조 확장

```typescript
// src/feature/roadmap/editor/types/node.types.ts

interface HorizonNodeData {
  // 기존 필드...
  title: string;
  color: string;
  // 학교 노드 필드 추가
  isSchoolNode?: boolean;
  curriculumId?: string;
  curriculumTitle?: string; // 교육 과정 제목 (표시용)
}
```

### 6. 학교 노드 시각적 구분

```typescript
// HorizonNode.tsx에서 학교 노드 스타일링

const NodeWrapper = styled.div<{ isSchoolNode?: boolean }>`
  ${({ isSchoolNode }) => isSchoolNode && css`
    border: 2px solid ${tokens.colors.school};
    background: ${tokens.colors.schoolBackground};

    &::before {
      content: '🏫';
      position: absolute;
      top: -8px;
      right: -8px;
    }
  `}
`;
```

## 교육 과정 API 연동

학교 노드 기능이 제대로 작동하려면 교육 과정 데이터도 필요:

```typescript
// 교육 과정 목록 조회
GET /curriculum/list

interface Curriculum {
  id: string;
  title: string;
  subject: string;
  grade: number;
  semester: number;
  unit: string;
}

// 특정 노드에 연결 가능한 교육 과정 검색
GET /curriculum/search?keyword={keyword}
```

## 구현 순서

1. **백엔드 API 확인/구현**
   - 노드 업데이트 API에 학교 노드 필드 지원 확인
   - 필요시 별도 전환 API 구현

2. **프론트엔드 API 클라이언트**
   - 전환 API 함수 구현
   - TanStack Query 훅 구현

3. **EditorSidebar 수정**
   - handleToggleConfirm 실제 API 호출로 변경
   - 에러 핸들링 추가

4. **노드 컴포넌트 업데이트**
   - 학교 노드 시각적 구분 추가
   - 교육 과정 정보 표시

5. **테스트**
   - 전환 기능 테스트
   - 새로고침 후 상태 유지 확인
   - 다른 사용자 동기화 확인

## 예상 작업량

| 작업 | 예상 시간 |
|------|----------|
| 백엔드 API 확인/조율 | 2시간 |
| API 클라이언트 구현 | 2시간 |
| TanStack Query 훅 | 2시간 |
| EditorSidebar 수정 | 3시간 |
| 노드 스타일링 | 2시간 |
| 테스트 및 디버깅 | 3시간 |

## 관련 이슈

- 학교 노드 기능은 교육 과정 API와 밀접하게 연관
- 교육 과정 검색/선택 UI 개선 필요 가능성

## 참고

- [EditorSidebar.tsx](../../../src/feature/roadmap/editor/components/layout/EditorSidebar/EditorSidebar.tsx)
- [SchoolNodeToggleModal](../../../src/feature/roadmap/editor/components/modals/SchoolNodeToggleModal/)
- [HorizonNode.tsx](../../../src/feature/roadmap/editor/components/nodes/HorizonNode/HorizonNode.tsx)
