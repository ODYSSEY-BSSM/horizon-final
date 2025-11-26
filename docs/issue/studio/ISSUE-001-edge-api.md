# ISSUE-001: Edge API 미지원

## 개요
| 항목 | 내용 |
|------|------|
| **심각도** | 🔴 Critical |
| **영향 범위** | Editor, Viewer |
| **관련 파일** | `src/feature/roadmap/editor/utils/edgeStorage.ts` |
| **상태** | Open |

## 문제 설명

현재 Edge(연결선) 데이터가 백엔드 API에 저장되지 않고 브라우저의 localStorage에만 저장됩니다. 이는 임시 솔루션으로 구현되었으나, 다음과 같은 심각한 문제를 야기합니다.

### 현재 구현

```typescript
// edgeStorage.ts
const STORAGE_KEY_PREFIX = 'roadmap-edges-';

export function saveEdges(roadmapId: number, edges: Edge[]): void {
  const key = getStorageKey(roadmapId);
  const serialized = JSON.stringify(edges);
  localStorage.setItem(key, serialized);
}

export function loadEdges(roadmapId: number): Edge[] {
  const key = getStorageKey(roadmapId);
  const serialized = localStorage.getItem(key);
  return serialized ? JSON.parse(serialized) : [];
}
```

## 문제점

### 1. 데이터 손실
- 브라우저 캐시/데이터 삭제 시 모든 연결선 정보 손실
- 시크릿/프라이빗 모드에서 세션 종료 시 데이터 손실

### 2. 디바이스 간 동기화 불가
- 다른 기기에서 로드맵 열면 연결선 없음
- 모바일/데스크톱 간 전환 시 불일치

### 3. 협업 기능 불가
- 다른 사용자가 추가한 연결선을 볼 수 없음
- 실시간 협업 시 연결선 상태 불일치

### 4. 스토리지 제한
- localStorage 용량 제한 (약 5-10MB)
- 많은 로드맵 편집 시 할당량 초과 가능

## 영향받는 기능

| 기능 | 영향 |
|------|------|
| 로드맵 저장 | 노드만 서버에 저장, 연결선은 로컬에만 |
| 로드맵 로드 | 서버 데이터 + 로컬 연결선 조합 |
| 협업 | 연결선 공유 불가 |
| 내보내기 | 완전한 데이터 내보내기 불가 |

## 관련 코드

### 저장 시점
```typescript
// RoadmapEditor.tsx:445-446
saveNodes(roadmapId, nodes);
saveEdges(roadmapId, edges);
```

### 로드 시점
```typescript
// RoadmapEditor.tsx:874-882
useEffect(() => {
  if (roadmapId && roadmapId > 0) {
    const savedEdges = loadEdges(roadmapId);
    if (savedEdges.length > 0) {
      setEdges(savedEdges);
    }
    setIsEdgesLoaded(true);
  }
}, [roadmapId, setEdges]);
```

### Viewer에서의 사용
```typescript
// content.tsx (viewer):27-28
// localStorage에서 엣지 불러오기 (Editor와 공유)
const edges = loadEdges(roadmapId);
```

## 해결 방안

### 1. 백엔드 Edge API 구현 (권장)

**필요한 엔드포인트**:
```
GET    /roadmap/{roadmapId}/edges        # 연결선 목록 조회
POST   /roadmap/{roadmapId}/edges        # 연결선 생성
PUT    /roadmap/{roadmapId}/edges/{id}   # 연결선 수정
DELETE /roadmap/{roadmapId}/edges/{id}   # 연결선 삭제
```

**Edge 데이터 구조**:
```typescript
interface EdgeRequest {
  source: number;        // 소스 노드 ID
  target: number;        // 타겟 노드 ID
  sourceHandle?: string; // 소스 핸들 (top, bottom, left, right)
  targetHandle?: string; // 타겟 핸들
  type?: string;         // 엣지 타입 (horizonEdge)
}

interface EdgeResponse {
  id: number;
  source: number;
  target: number;
  sourceHandle: string;
  targetHandle: string;
  type: string;
  roadmapId: number;
}
```

### 2. WebSocket 실시간 동기화

**필요한 토픽**:
```
/topic/edge/roadmap/{roadmapId}/created
/topic/edge/roadmap/{roadmapId}/updated
/topic/edge/roadmap/{roadmapId}/deleted
```

### 3. 프론트엔드 수정

```typescript
// 새로운 훅: useEdgeApi.ts
export function useEdges(roadmapId: number) {
  return useQuery({
    queryKey: ['edges', roadmapId],
    queryFn: () => getEdges(roadmapId),
    enabled: !!roadmapId,
  });
}

export function useCreateEdge(roadmapId: number) {
  return useMutation({
    mutationFn: (data: EdgeRequest) => createEdge(roadmapId, data),
    onMutate: async (newEdge) => {
      // 낙관적 업데이트
    },
  });
}
```

## 마이그레이션 계획

1. **백엔드 API 개발** (1주)
2. **프론트엔드 API 클라이언트 구현** (3일)
3. **localStorage 데이터 마이그레이션** (2일)
   - 기존 localStorage 데이터를 서버로 동기화
   - 마이그레이션 완료 후 localStorage 데이터 삭제
4. **테스트 및 검증** (2일)
5. **localStorage 코드 제거** (1일)

## 임시 해결책

API 개발 전까지 사용할 수 있는 임시 해결책:

```typescript
// 서버에 전체 로드맵 JSON으로 저장 (임시)
interface RoadmapSnapshot {
  nodes: NodeResponse[];
  edges: Edge[];
  version: number;
  savedAt: string;
}
```

## 참고

- [edgeStorage.ts](../../../src/feature/roadmap/editor/utils/edgeStorage.ts)
- [RoadmapEditor.tsx](../../../src/feature/roadmap/editor/RoadmapEditor.tsx)
- [React Flow Edge Documentation](https://reactflow.dev/docs/api/edges/)
