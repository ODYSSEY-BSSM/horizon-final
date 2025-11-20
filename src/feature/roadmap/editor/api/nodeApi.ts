/**
 * Roadmap Editor - Node API Client
 * API functions and TanStack Query hooks for roadmap editor node operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { NodeRequest, NodeResponse, SubjectRequest } from '../types/api.types';

// Optimistic update ID counter (음수로 시작하여 실제 ID와 충돌 방지)
let optimisticIdCounter = -1;

// ============================================================================
// API Client Functions
// ============================================================================

/**
 * 노드 목록 조회
 * GET /roadmap/{roadmapId}/nodes
 */
export async function getNodes(roadmapId: number): Promise<NodeResponse[]> {
  const response = await apiClient.get<{ nodes: NodeResponse[] }>(`/roadmap/${roadmapId}/nodes`);
  return response.nodes;
}

/**
 * 개별 노드 조회
 * GET /roadmap/{roadmapId}/nodes/{nodeId}
 * 자식 노드, 진행률, 교육 상태 포함
 */
export async function getNodeById(roadmapId: number, nodeId: number): Promise<NodeResponse> {
  return apiClient.get<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
}

/**
 * 노드 생성
 * POST /roadmap/{roadmapId}/nodes
 */
export async function createNode(roadmapId: number, data: NodeRequest): Promise<NodeResponse> {
  return apiClient.post<NodeResponse>(`/roadmap/${roadmapId}/nodes`, data);
}

/**
 * 노드 업데이트
 * PUT /roadmap/{roadmapId}/nodes/{nodeId}
 */
export async function updateNode(
  roadmapId: number,
  nodeId: number,
  data: NodeRequest,
): Promise<NodeResponse> {
  return apiClient.put<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`, data);
}

/**
 * 노드 삭제
 * DELETE /roadmap/{roadmapId}/nodes/{nodeId}
 */
export async function deleteNode(roadmapId: number, nodeId: number): Promise<void> {
  return apiClient.delete<void>(`/roadmap/${roadmapId}/nodes/${nodeId}`);
}

/**
 * 교육 상태 업데이트
 * PATCH /roadmap/{roadmapId}/nodes/{nodeId}
 */
export async function updateEducationStatus(
  roadmapId: number,
  nodeId: number,
  data: SubjectRequest,
): Promise<NodeResponse> {
  return apiClient.patch<NodeResponse>(`/roadmap/${roadmapId}/nodes/${nodeId}`, data);
}

// ============================================================================
// TanStack Query Keys
// ============================================================================

export const editorNodeKeys = {
  all: ['editor-nodes'] as const,
  lists: () => [...editorNodeKeys.all, 'list'] as const,
  list: (roadmapId: number) => [...editorNodeKeys.lists(), roadmapId] as const,
  details: () => [...editorNodeKeys.all, 'detail'] as const,
  detail: (roadmapId: number, nodeId: number) =>
    [...editorNodeKeys.details(), roadmapId, nodeId] as const,
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================

/**
 * 노드 목록 조회 훅
 * @param roadmapId - 로드맵 ID
 * @returns Query result with NodeResponse[]
 */
export function useNodes(roadmapId: number) {
  return useQuery({
    queryKey: editorNodeKeys.list(roadmapId),
    queryFn: () => getNodes(roadmapId),
    enabled: !!roadmapId && roadmapId > 0,
  });
}

/**
 * 개별 노드 조회 훅
 * @param roadmapId - 로드맵 ID
 * @param nodeId - 노드 ID
 * @returns Query result with NodeResponse (with childNode, progress, education status)
 */
export function useNode(roadmapId: number, nodeId: number) {
  return useQuery({
    queryKey: editorNodeKeys.detail(roadmapId, nodeId),
    queryFn: () => getNodeById(roadmapId, nodeId),
    enabled: !!roadmapId && roadmapId > 0 && !!nodeId && nodeId > 0,
  });
}

/**
 * 노드 생성 훅
 * @param roadmapId - 로드맵 ID
 * @returns Mutation for creating a node with optimistic updates
 */
export function useCreateNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NodeRequest) => createNode(roadmapId, data),

    // 낙관적 업데이트: 임시 노드 추가
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: editorNodeKeys.list(roadmapId) });

      const previousNodes = queryClient.getQueryData<NodeResponse[]>(
        editorNodeKeys.list(roadmapId),
      );

      // 임시 ID로 노드 추가 (음수 카운터 사용하여 충돌 방지)
      if (previousNodes) {
        const tempNode: NodeResponse = {
          id: optimisticIdCounter--, // 음수 ID로 충돌 방지
          roadmapId,
          parentNodeId: data.parentNodeId || 0,
          childNode: [],
          progress: 0,
          isEducation: false,
          subject: '',
          ...data,
        };

        queryClient.setQueryData<NodeResponse[]>(editorNodeKeys.list(roadmapId), [
          ...previousNodes,
          tempNode,
        ]);
      }

      return { previousNodes };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousNodes) {
        queryClient.setQueryData(editorNodeKeys.list(roadmapId), context.previousNodes);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: editorNodeKeys.list(roadmapId) });
    },

    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 노드 업데이트 훅
 * @param roadmapId - 로드맵 ID
 * @returns Mutation for updating a node with optimistic updates
 */
export function useUpdateNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, data }: { nodeId: number; data: NodeRequest }) =>
      updateNode(roadmapId, nodeId, data),

    // 낙관적 업데이트: 즉시 UI 반영
    onMutate: async ({ nodeId, data }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: editorNodeKeys.list(roadmapId) });

      // 이전 데이터 백업
      const previousNodes = queryClient.getQueryData<NodeResponse[]>(
        editorNodeKeys.list(roadmapId),
      );

      // 낙관적으로 캐시 업데이트
      if (previousNodes) {
        queryClient.setQueryData<NodeResponse[]>(editorNodeKeys.list(roadmapId), (old) =>
          old
            ? old.map((node) => (node.id === nodeId ? { ...node, ...data, id: nodeId } : node))
            : old,
        );
      }

      // 롤백용 이전 데이터 반환
      return { previousNodes };
    },

    // 에러 발생 시 롤백
    onError: (_error, _variables, context) => {
      if (context?.previousNodes) {
        queryClient.setQueryData(editorNodeKeys.list(roadmapId), context.previousNodes);
      }
    },

    // 성공/실패 관계없이 최종적으로 서버 데이터로 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: editorNodeKeys.list(roadmapId) });
    },

    // 네트워크 에러 시 자동 재시도
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });
}

/**
 * 노드 삭제 훅
 * @param roadmapId - 로드맵 ID
 * @returns Mutation for deleting a node with optimistic updates
 */
export function useDeleteNode(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nodeId: number) => deleteNode(roadmapId, nodeId),

    // 낙관적 업데이트: 즉시 노드 제거
    onMutate: async (nodeId) => {
      await queryClient.cancelQueries({ queryKey: editorNodeKeys.list(roadmapId) });

      const previousNodes = queryClient.getQueryData<NodeResponse[]>(
        editorNodeKeys.list(roadmapId),
      );

      // 낙관적으로 노드 제거
      if (previousNodes) {
        queryClient.setQueryData<NodeResponse[]>(
          editorNodeKeys.list(roadmapId),
          previousNodes.filter((node) => node.id !== nodeId),
        );
      }

      return { previousNodes };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousNodes) {
        queryClient.setQueryData(editorNodeKeys.list(roadmapId), context.previousNodes);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: editorNodeKeys.list(roadmapId) });
    },

    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 교육 상태 업데이트 훅
 * @param roadmapId - 로드맵 ID
 * @returns Mutation for updating education status with optimistic updates
 */
export function useUpdateEducationStatus(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, data }: { nodeId: number; data: SubjectRequest }) =>
      updateEducationStatus(roadmapId, nodeId, data),

    // 낙관적 업데이트: 교육 상태 즉시 반영
    onMutate: async ({ nodeId, data }) => {
      await queryClient.cancelQueries({ queryKey: editorNodeKeys.list(roadmapId) });

      const previousNodes = queryClient.getQueryData<NodeResponse[]>(
        editorNodeKeys.list(roadmapId),
      );

      if (previousNodes) {
        queryClient.setQueryData<NodeResponse[]>(editorNodeKeys.list(roadmapId), (old) =>
          old
            ? old.map((node) =>
                node.id === nodeId ? { ...node, isEducation: true, subject: data.subject } : node,
              )
            : old,
        );
      }

      return { previousNodes };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousNodes) {
        queryClient.setQueryData(editorNodeKeys.list(roadmapId), context.previousNodes);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: editorNodeKeys.list(roadmapId) });
    },

    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
