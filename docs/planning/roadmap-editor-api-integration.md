# Roadmap Editor API Integration Plan

**작성일**: 2025-01-21
**브랜치**: `claude/fix-roadmap-editor-index-01HErQ5UaTCCwQ7SKcSuVy9J`
**상태**: Toast 구현 완료, API 연동 준비 단계

---

## 1. 현재 브랜치 작업 완료 사항

### ✅ 완료된 작업 (2025-01-21)
- **Toast 컴포넌트 구현** (src/shared/ui/Toast/)
  - Position 선택 기능 (top/bottom)
  - Slide-in/out 애니메이션
  - Swipe-to-dismiss 기능 (100px threshold)
  - Timer progress bar (3px left bar, height animation)
  - Mouse & touch 이벤트 지원
  - Drag 중 timer 일시정지
  - Exit 애니메이션 중에도 timer 유지

- **Lint & Build 수정**
  - Toast.tsx: early return → block statement 변경
  - edgeStorage.ts: empty catch block에 주석 추가 (3곳)
  - nodeConverter.ts: empty else block 제거
  - ✅ Lint 통과, Build 성공

### 📝 현재 브랜치의 전체 커밋 히스토리
```
cea3f85 feat: Toast 구현
fc40440 feat: 학교/개인 토글 버튼
1ead944 fix: 에디터 드롭다운 수정
466e167 fix: 툴바 ux 수정
fa8e76e feat:
ff4c752 fix: 타입 드롭다운 적용
c4d8844 feat: 컬러드롭다운 적용
d4d2dde fix: 섹션 라벨 수정 추가
7148bc3 fix: comprehensive roadmap editor fixes (17+ issues)
315a218 fix: resolve 19 critical/major/moderate issues in roadmap editor
```

### 🎯 브랜치 목적
- Roadmap Editor의 UI/UX 이슈 수정
- Toast 알림 시스템 구현
- Editor 기본 기능 안정화

---

## 2. 다음 단계: Roadmap Editor API 연동

현재 브랜치의 작업은 완료되었으며, 다음 메인 작업은 **Roadmap Editor의 서버 API 연동**입니다.

### 📋 참고 문서
기존에 작성된 상세 계획: `docs/feature51/1120first.md`

### 🚀 API 연동 주요 단계

#### Phase 1: 기초 작업 (우선순위: 🔴 Critical)
1. **API 타입 정의**
   - 파일: `src/feature/roadmap/editor/types/api.types.ts`
   - 내용:
     - `NodeRequest` - 노드 생성/수정 요청 타입
     - `NodeResponse` - 노드 응답 타입
     - `ApiNodeType` - 'TOP' | 'MIDDLE' | 'BOTTOM'
     - `ApiColor` - 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE'

2. **데이터 변환 유틸리티**
   - 파일: `src/feature/roadmap/editor/utils/nodeConverter.ts`
   - 기능:
     - React Flow ↔ API 데이터 변환
     - 타입 매핑 (title/standard/secondary ↔ TOP/MIDDLE/BOTTOM)
     - 색상 매핑 (소문자 ↔ 대문자)
     - 좌표 변환 (상대 ↔ 절대)

3. **노드 조회 API 연동**
   - 파일: `src/feature/roadmap/editor/api/nodeApi.ts`
   - 엔드포인트: `GET /roadmap/{roadmapId}/nodes`
   - TanStack Query Hook: `useNodes(roadmapId)`

4. **초기 로딩 구현**
   - RoadmapEditor에서 roadmapId prop 받기
   - useNodes로 서버에서 노드 불러오기
   - API 데이터 → React Flow 형식 변환
   - setNodes() 호출

#### Phase 2: 저장 기능 (우선순위: 🟡 Important)
5. **노드 업데이트 API**
   - 엔드포인트: `PUT /roadmap/{roadmapId}/nodes/{nodeId}`
   - Hook: `useUpdateNode()`
   - 변경 감지 (dirty checking)

6. **저장 로직 구현**
   - handleSave() TODO 구현
   - React Flow → API 형식 변환
   - 낙관적 업데이트 적용

7. **에러 핸들링**
   - API 에러 → Toast 메시지 표시
   - 네트워크 오류 재시도
   - 롤백 처리

8. **로딩 상태 관리**
   - 초기 로딩 스피너
   - 저장 중 표시 (기존 headerState 활용)

#### Phase 3: 생성/삭제 (우선순위: 🟢 Additional)
9. **노드 생성 API**
   - 엔드포인트: `POST /roadmap/{roadmapId}/nodes`
   - Hook: `useCreateNode()`
   - 임시 ID → 실제 ID 교체

10. **노드 삭제 API**
    - 엔드포인트: `DELETE /roadmap/{roadmapId}/nodes/{nodeId}`
    - Hook: `useDeleteNode()`
    - 에러 시 롤백

11. **낙관적 업데이트 완성**
    - TanStack Query optimistic update 활용
    - ID 매핑 테이블 관리

#### Phase 4: Edge 처리 (임시 솔루션)
12. **Edge 로컬 스토리지 저장**
    - 파일: `src/feature/roadmap/editor/utils/edgeStorage.ts` (✅ 이미 존재)
    - localStorage 활용하여 roadmapId별 Edge 저장
    - 초기 로드 시 복원
    - ⚠️ 백엔드 Edge API 추가 요청 병행

---

## 3. 주요 이슈 및 설계 결정

### 🚨 Critical Issue: Edge 정보 손실
- **문제**: API에 Edge 저장 방법이 없음 (연결선 정보 손실)
- **현재 대응**:
  - ✅ `edgeStorage.ts`로 로컬 스토리지 임시 저장
  - roadmapId별로 분리 저장
  - 새로고침 시 복원 가능
- **장기 해결책**: 백엔드 팀에게 Edge API 추가 요청

### 타입 매핑 규칙
```typescript
// React Flow → API
const TYPE_MAPPING = {
  title: 'TOP',
  standard: 'MIDDLE',
  secondary: 'BOTTOM',
};

// 색상 변환
const color = reactFlowColor.toUpperCase(); // 'blue' → 'BLUE'
```

### 좌표 시스템
- **React Flow**: 부모 기준 상대 좌표
- **API**: 절대 좌표 (추정)
- **변환 로직**:
  - 저장 시: 부모 위치 + 상대 좌표 = 절대 좌표
  - 로드 시: 절대 좌표 - 부모 위치 = 상대 좌표

### 섹션/텍스트 노드 처리
- **섹션**: 큰 크기 노드로 저장 (API 호환)
- **텍스트**: 로컬 전용, 서버 저장 안 함 (UI 편의 기능)

---

## 4. 다음 작업 시작 가이드

### Step 1: 새 브랜치 생성
```bash
# 현재 브랜치 작업 완료 확인
git status

# 새 브랜치 생성 (main 또는 develop 기준)
git checkout main
git pull origin main
git checkout -b feature/roadmap-editor-api-integration

# 또는 현재 브랜치에서 계속 작업하려면
git checkout claude/fix-roadmap-editor-index-01HErQ5UaTCCwQ7SKcSuVy9J
```

### Step 2: API 타입 정의부터 시작
```typescript
// src/feature/roadmap/editor/types/api.types.ts
export type ApiNodeType = 'TOP' | 'MIDDLE' | 'BOTTOM';
export type ApiColor = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';

export interface NodeRequest {
  title: string;           // max 64 chars
  description: string;     // max 1500 chars
  height: number;          // int32
  width: number;           // int32
  type: ApiNodeType;
  x: number;               // int32 (절대 좌표)
  y: number;               // int32 (절대 좌표)
  color: ApiColor;
  parentNodeId?: number;   // int64
}

export interface NodeResponse {
  id: number;              // int64
  title: string;
  description: string;
  height: number;
  width: number;
  type: ApiNodeType;
  x: number;
  y: number;
  color: ApiColor;
  roadmapId: number;
  parentNodeId: number;
  childNode: SimpleNodeResponse[];
  progress: number;
  isEducation: boolean;
  subject: string;
}

export interface SimpleNodeResponse {
  id: number;
  title: string;
  description: string;
}
```

### Step 3: 변환 유틸리티 구현
```typescript
// src/feature/roadmap/editor/utils/nodeConverter.ts
import type { Node } from 'reactflow';
import type { NodeRequest, NodeResponse } from '../types/api.types';

// React Flow → API
export function reactFlowToApi(node: Node): NodeRequest {
  // 1. 타입 매핑
  // 2. 색상 변환
  // 3. 좌표 변환 (상대 → 절대)
  // 4. NodeRequest 형식으로 반환
}

// API → React Flow
export function apiToReactFlow(apiNode: NodeResponse): Node {
  // 1. 타입 역매핑
  // 2. 색상 역변환
  // 3. 좌표 변환 (절대 → 상대)
  // 4. React Flow Node 형식으로 반환
}
```

### Step 4: API 클라이언트 구현
```typescript
// src/feature/roadmap/editor/api/nodeApi.ts
import { client } from '@/shared/api/client';
import type { NodeRequest, NodeResponse } from '../types/api.types';

export const nodeApi = {
  // 노드 목록 조회
  getNodes: async (roadmapId: number) => {
    const response = await client.get<NodeResponse[]>(
      `/roadmap/${roadmapId}/nodes`
    );
    return response.data;
  },

  // 노드 생성
  createNode: async (roadmapId: number, data: NodeRequest) => {
    const response = await client.post<NodeResponse>(
      `/roadmap/${roadmapId}/nodes`,
      data
    );
    return response.data;
  },

  // 노드 업데이트
  updateNode: async (roadmapId: number, nodeId: number, data: NodeRequest) => {
    const response = await client.put<NodeResponse>(
      `/roadmap/${roadmapId}/nodes/${nodeId}`,
      data
    );
    return response.data;
  },

  // 노드 삭제
  deleteNode: async (roadmapId: number, nodeId: number) => {
    await client.delete(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },
};
```

### Step 5: TanStack Query Hooks
```typescript
// src/feature/roadmap/editor/hooks/useNodeQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nodeApi } from '../api/nodeApi';
import { apiToReactFlow, reactFlowToApi } from '../utils/nodeConverter';

// 노드 목록 조회
export function useNodes(roadmapId: number) {
  return useQuery({
    queryKey: ['roadmap', roadmapId, 'nodes'],
    queryFn: () => nodeApi.getNodes(roadmapId),
    select: (data) => data.map(apiToReactFlow),
  });
}

// 노드 생성
export function useCreateNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapId, node }: { roadmapId: number; node: Node }) => {
      const nodeRequest = reactFlowToApi(node);
      return nodeApi.createNode(roadmapId, nodeRequest);
    },
    onSuccess: (_, { roadmapId }) => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', roadmapId, 'nodes'] });
    },
  });
}
```

---

## 5. 테스트 계획

### 단계별 테스트
1. **타입 변환 테스트**
   - React Flow → API → React Flow 왕복 변환 검증
   - 타입/색상/좌표 정확성 확인

2. **API 연동 테스트**
   - 개발 서버 연결 확인
   - GET /nodes 응답 확인
   - POST/PUT/DELETE 동작 확인

3. **Edge 케이스 테스트**
   - 부모-자식 관계 좌표 변환
   - 큰 로드맵 (100+ 노드) 성능
   - 네트워크 오류 시나리오

4. **사용자 시나리오 테스트**
   - 로드맵 열기 → 노드 추가 → 저장 → 새로고침 → 복원
   - 노드 드래그 → 저장 → 위치 유지 확인
   - Edge 생성 → 새로고침 → Edge 복원 확인

---

## 6. 리스크 관리

| 리스크 | 영향도 | 완화 방안 |
|--------|--------|-----------|
| Edge 정보 손실 | 🔴 High | 로컬 스토리지 임시 저장 + 백엔드 API 요청 |
| 좌표 시스템 불일치 | 🟡 Medium | 초기 테스트로 빠르게 검증, 변환 로직 단위 테스트 |
| 대량 노드 성능 | 🟢 Low | Dirty checking, debounce 적용 |
| 동시 수정 충돌 | 🟢 Low | WebSocket 단계에서 처리 (Phase 5) |

---

## 7. 완료 조건 (Definition of Done)

- [ ] API 타입 정의 완료
- [ ] 데이터 변환 로직 구현 및 단위 테스트 통과
- [ ] GET /nodes API 연동 및 초기 로딩 동작
- [ ] PUT /nodes API 연동 및 저장 기능 동작
- [ ] POST /nodes API 연동 및 생성 기능 동작
- [ ] DELETE /nodes API 연동 및 삭제 기능 동작
- [ ] Edge 로컬 스토리지 저장/복원 동작
- [ ] 에러 핸들링 및 Toast 알림 표시
- [ ] 로딩 상태 UI 표시
- [ ] 수동 테스트 시나리오 통과
- [ ] Lint 및 Build 통과
- [ ] 코드 리뷰 완료

---

## 8. 참고 자료

- **기존 계획 문서**: `docs/feature51/1120first.md` (상세 API 명세 및 데이터 구조)
- **Swagger 문서**: https://raw.githubusercontent.com/leegunwoooo/swagger-ui/refs/heads/master/swagger.json
- **API 클라이언트**: `src/shared/api/client.ts`
- **WebSocket**: `src/shared/api/stompWebSocket.ts`
- **기존 노드 타입**: `src/feature/roadmap/editor/types/node.types.ts`
- **Edge 스토리지**: `src/feature/roadmap/editor/utils/edgeStorage.ts`

---

## 9. 작업 우선순위

### 🔴 Week 1 (우선순위 1)
- API 타입 정의
- 데이터 변환 로직
- GET /nodes 연동
- 초기 로딩 구현

### 🟡 Week 2 (우선순위 2)
- PUT /nodes 연동
- 저장 로직 구현
- 에러 핸들링
- 로딩 상태 관리

### 🟢 Week 3 (우선순위 3)
- POST /nodes 연동
- DELETE /nodes 연동
- 낙관적 업데이트
- Edge 로컬 스토리지 완성

### ⏸️ Future (별도 이슈)
- WebSocket 실시간 동기화
- 멀티 플레이어 협업
- Conflict resolution

---

**다음 작업 시작**: API 타입 정의부터 시작하세요! 🚀
