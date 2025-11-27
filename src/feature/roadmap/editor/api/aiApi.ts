/**
 * Roadmap Editor - AI API Client
 * API functions and TanStack Query hooks for AI-powered roadmap generation and node modification
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { nodeKeys } from '../../hooks/useNodeQueries';
import type {
  AINodeModifyRequest,
  AINodeModifyResponse,
  AIRoadmapGenerateRequest,
  AIRoadmapGenerateResponse,
} from '../types/ai.types';

// ============================================================================
// API Client Functions
// ============================================================================

/**
 * AI 로드맵 생성
 * POST /directories/{directoryId}/nodes/ai
 *
 * @param directoryId - 폴더 ID
 * @param data - 생성 요청 데이터 (description, language, courses)
 * @param teamId - 팀 ID (optional, 팀 로드맵인 경우)
 * @returns 생성된 로드맵 정보와 노드 목록
 */
export async function generateAIRoadmap(
  directoryId: number,
  data: AIRoadmapGenerateRequest,
  teamId?: number,
): Promise<AIRoadmapGenerateResponse> {
  const url = teamId
    ? `/directories/${directoryId}/nodes/ai?teamId=${teamId}`
    : `/directories/${directoryId}/nodes/ai`;

  return apiClient.post<AIRoadmapGenerateResponse>(url, data);
}

/**
 * AI 노드 수정
 * PUT /roadmap/{roadmapId}/nodes/ai
 *
 * @param roadmapId - 로드맵 ID
 * @param data - 수정 요청 데이터 (description, nodes)
 * @returns 수정된 노드 목록
 */
export async function modifyAINodes(
  roadmapId: number,
  data: AINodeModifyRequest,
): Promise<AINodeModifyResponse[]> {
  return apiClient.put<AINodeModifyResponse[]>(`/roadmap/${roadmapId}/nodes/ai`, data);
}

// ============================================================================
// TanStack Query Keys
// ============================================================================

export const aiKeys = {
  all: ['ai'] as const,
  generate: (directoryId: number) => [...aiKeys.all, 'generate', directoryId] as const,
  modify: (roadmapId: number) => [...aiKeys.all, 'modify', roadmapId] as const,
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================

/**
 * AI 로드맵 생성 훅
 * @param directoryId - 폴더 ID
 * @param teamId - 팀 ID (optional)
 * @returns Mutation for generating AI roadmap
 */
export function useGenerateAIRoadmap(directoryId: number, teamId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AIRoadmapGenerateRequest) => generateAIRoadmap(directoryId, data, teamId),

    onSuccess: (response) => {
      // 생성된 로드맵의 노드 목록 캐시 설정
      if (response.roadmap?.id) {
        queryClient.setQueryData(nodeKeys.list(response.roadmap.id), response.nodes);
      }

      // 로드맵 목록 캐시 무효화 (새 로드맵 반영)
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });

      // 폴더 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['directories'] });
    },

    onError: (_error) => {
      // Error handled by mutation state
    },

    // AI 요청은 재시도하지 않음 (비용 및 시간 고려)
    retry: false,
  });
}

/**
 * AI 노드 수정 훅
 * @param roadmapId - 로드맵 ID
 * @returns Mutation for modifying nodes with AI
 */
export function useModifyAINodes(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AINodeModifyRequest) => modifyAINodes(roadmapId, data),

    onSuccess: () => {
      // 노드 목록 캐시 무효화 (수정된 노드 반영)
      queryClient.invalidateQueries({ queryKey: nodeKeys.list(roadmapId) });
    },

    onError: (_error) => {
      // Error handled by mutation state
    },

    // AI 요청은 재시도하지 않음
    retry: false,
  });
}
