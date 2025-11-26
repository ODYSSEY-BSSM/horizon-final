# ISSUE-003: Section/Text 노드 API 미연동

## 개요
| 항목 | 내용 |
|------|------|
| **심각도** | 🟡 Major |
| **영향 범위** | Editor |
| **관련 파일** | `src/feature/roadmap/editor/RoadmapEditor.tsx` |
| **상태** | Open |

## 문제 설명

현재 RoadmapEditor에서 Section과 Text 노드는 생성/편집이 가능하지만, 서버 API에 저장되지 않습니다. HorizonNode(일반 노드)만 서버에 저장되고, Section과 Text는 로컬 상태로만 존재합니다.

## 현재 구현 상태

### 저장 로직 (saveNodes 함수)
**위치**: `RoadmapEditor.tsx:461-489`

```typescript
const saveNodes = useCallback(async (roadmapId: number, nodes: Node<HorizonNodeData>[]) => {
  // horizonNode만 필터링 - Section/Text 노드는 제외됨!
  const horizonNodes = nodes.filter((node) => node.type === 'horizonNode');

  // horizonNode만 저장
  for (const node of horizonNodes) {
    // ... 저장 로직
  }
}, [/* ... */]);
```

**문제점**:
- `nodes.filter((node) => node.type === 'horizonNode')` 조건으로 인해 Section과 Text 노드가 저장에서 제외됨
- Section (`horizonSection`)과 Text (`horizonText`) 타입의 노드는 API 호출이 이루어지지 않음

### 노드 타입별 현재 상태

| 노드 타입 | 서버 저장 | 실시간 동기화 | 페이지 새로고침 후 |
|----------|----------|--------------|------------------|
| horizonNode | ✅ 저장됨 | ✅ 동작 | ✅ 유지됨 |
| horizonSection | ❌ 미저장 | ❌ TODO 상태 | ❌ 사라짐 |
| horizonText | ❌ 미저장 | ❌ TODO 상태 | ❌ 사라짐 |

## 문제점

### 1. 데이터 손실
- 페이지 새로고침 시 Section/Text 노드 사라짐
- 브라우저 탭 닫으면 모든 Section/Text 작업 손실
- 다른 기기에서 로드맵 열면 Section/Text 없음

### 2. 협업 불가
- 다른 사용자가 추가한 Section/Text를 볼 수 없음
- 실시간 동기화가 되어도 저장이 안 되면 무의미

### 3. 기능 불완전
- 로드맵 편집기의 핵심 기능인 그룹화(Section)와 설명(Text) 기능이 임시적으로만 작동
- 사용자 경험 저하

## 영향받는 기능

### Section 노드
- 노드들을 그룹화하여 정리하는 기능
- 로드맵의 구조를 시각적으로 표현
- 현재: 생성 가능하지만 저장 안 됨

### Text 노드
- 로드맵에 설명이나 주석 추가
- 학습 가이드, 팁 등 텍스트 정보 제공
- 현재: 생성 가능하지만 저장 안 됨

## 해결 방안

### 1. 백엔드 API 구현 (필요한 경우)

#### Section API 엔드포인트
```
POST   /roadmap/{roadmapId}/sections       # Section 생성
GET    /roadmap/{roadmapId}/sections       # Section 목록 조회
PUT    /roadmap/{roadmapId}/sections/{id}  # Section 수정
DELETE /roadmap/{roadmapId}/sections/{id}  # Section 삭제
```

#### Text API 엔드포인트
```
POST   /roadmap/{roadmapId}/texts          # Text 생성
GET    /roadmap/{roadmapId}/texts          # Text 목록 조회
PUT    /roadmap/{roadmapId}/texts/{id}     # Text 수정
DELETE /roadmap/{roadmapId}/texts/{id}     # Text 삭제
```

### 2. 프론트엔드 API 클라이언트 구현

```typescript
// src/feature/roadmap/editor/api/sectionApi.ts
export async function createSection(roadmapId: number, data: SectionRequest): Promise<SectionResponse> {
  const response = await apiClient.post<ApiResponse<SectionResponse>>(
    `/roadmap/${roadmapId}/sections`,
    data
  );
  return response.data.data;
}

export async function updateSection(roadmapId: number, sectionId: number, data: SectionUpdateRequest): Promise<SectionResponse> {
  const response = await apiClient.put<ApiResponse<SectionResponse>>(
    `/roadmap/${roadmapId}/sections/${sectionId}`,
    data
  );
  return response.data.data;
}

export async function deleteSection(roadmapId: number, sectionId: number): Promise<void> {
  await apiClient.delete(`/roadmap/${roadmapId}/sections/${sectionId}`);
}
```

### 3. saveNodes 함수 확장

```typescript
const saveNodes = useCallback(async (roadmapId: number, nodes: Node[]) => {
  // 노드 타입별 분리
  const horizonNodes = nodes.filter((node) => node.type === 'horizonNode');
  const sectionNodes = nodes.filter((node) => node.type === 'horizonSection');
  const textNodes = nodes.filter((node) => node.type === 'horizonText');

  // 병렬로 모든 노드 타입 저장
  await Promise.all([
    saveHorizonNodes(roadmapId, horizonNodes),
    saveSectionNodes(roadmapId, sectionNodes),
    saveTextNodes(roadmapId, textNodes),
  ]);
}, [/* ... */]);
```

### 4. 데이터 타입 정의

```typescript
// src/feature/roadmap/editor/types/section.types.ts
interface SectionRequest {
  title: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  color?: string;
}

interface SectionResponse {
  id: number;
  roadmapId: number;
  title: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// src/feature/roadmap/editor/types/text.types.ts
interface TextRequest {
  content: string;
  positionX: number;
  positionY: number;
  fontSize?: number;
  fontWeight?: string;
}

interface TextResponse {
  id: number;
  roadmapId: number;
  content: string;
  positionX: number;
  positionY: number;
  fontSize: number;
  fontWeight: string;
  createdAt: string;
  updatedAt: string;
}
```

### 5. TanStack Query 통합

```typescript
// src/feature/roadmap/editor/hooks/useSectionMutations.ts
export function useSectionMutations(roadmapId: number) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: SectionRequest) => createSection(roadmapId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', roadmapId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: number; data: SectionUpdateRequest }) =>
      updateSection(roadmapId, sectionId, data),
    onMutate: async ({ sectionId, data }) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ['sections', roadmapId] });
      const previous = queryClient.getQueryData(['sections', roadmapId]);
      queryClient.setQueryData(['sections', roadmapId], (old: SectionResponse[]) =>
        old.map(s => s.id === sectionId ? { ...s, ...data } : s)
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['sections', roadmapId], context?.previous);
    },
  });

  return { createMutation, updateMutation };
}
```

## 임시 해결책

API 개발 전 임시로 localStorage 사용 (Edge와 동일한 방식):

```typescript
// src/feature/roadmap/editor/utils/sectionStorage.ts
const STORAGE_KEY_PREFIX = 'roadmap-sections-';

export function saveSections(roadmapId: number, sections: SectionData[]): void {
  const key = `${STORAGE_KEY_PREFIX}${roadmapId}`;
  localStorage.setItem(key, JSON.stringify(sections));
}

export function loadSections(roadmapId: number): SectionData[] {
  const key = `${STORAGE_KEY_PREFIX}${roadmapId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
```

**⚠️ 주의**: localStorage 방식은 [ISSUE-001](./ISSUE-001-edge-api.md)과 동일한 문제를 가짐

## 구현 순서

1. **백엔드 API 확인/구현**
   - 기존 Section/Text API가 있는지 확인
   - 없다면 API 스펙 정의 및 구현 요청

2. **프론트엔드 API 클라이언트**
   - `sectionApi.ts`, `textApi.ts` 생성
   - TanStack Query 훅 구현

3. **saveNodes 로직 확장**
   - Section/Text 저장 로직 추가
   - 에러 핸들링 구현

4. **로드 로직 구현**
   - 페이지 로드 시 Section/Text 함께 불러오기
   - 기존 노드 데이터와 병합

5. **WebSocket 핸들러 연동**
   - ISSUE-002의 구현과 연계
   - 실시간 동기화 완성

## 관련 이슈

- [ISSUE-001: Edge API 미지원](./ISSUE-001-edge-api.md) - 동일한 패턴의 문제
- [ISSUE-002: WebSocket 핸들러 미구현](./ISSUE-002-websocket-handlers.md) - 실시간 동기화 필요

## 참고

- [RoadmapEditor.tsx](../../../src/feature/roadmap/editor/RoadmapEditor.tsx)
- [HorizonSection.tsx](../../../src/feature/roadmap/editor/components/nodes/HorizonSection/HorizonSection.tsx)
- [HorizonText.tsx](../../../src/feature/roadmap/editor/components/nodes/HorizonText/HorizonText.tsx)
