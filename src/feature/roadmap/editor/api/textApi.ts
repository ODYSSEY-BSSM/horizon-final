/**
 * Roadmap Editor - Text API Client
 * API functions and TanStack Query hooks for text operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { TextRequest, TextResponse, TextUpdateRequest } from '../types/api.types';

// ============================================================================
// API Client Functions
// ============================================================================

/**
 * 개별 텍스트 조회
 * GET /{roadmap-id}/text/{id}
 */
export async function getText(roadmapId: number, textId: number): Promise<TextResponse> {
  const response = await apiClient.get<{ texts: TextResponse }>(`/${roadmapId}/text/${textId}`);
  return response.texts;
}

/**
 * 텍스트 생성
 * POST /{roadmap-id}/text
 */
export async function createText(roadmapId: number, data: TextRequest): Promise<TextResponse> {
  const response = await apiClient.post<{ texts: TextResponse }>(`/${roadmapId}/text`, data);
  return response.texts;
}

/**
 * 텍스트 업데이트
 * PATCH /{roadmap-id}/text/{id}
 */
export async function updateText(
  roadmapId: number,
  textId: number,
  data: TextUpdateRequest,
): Promise<TextResponse> {
  const response = await apiClient.patch<{ texts: TextResponse }>(
    `/${roadmapId}/text/${textId}`,
    data,
  );
  return response.texts;
}

/**
 * 텍스트 삭제
 * DELETE /{roadmap-id}/text/{id}
 */
export async function deleteText(roadmapId: number, textId: number): Promise<void> {
  return apiClient.delete<void>(`/${roadmapId}/text/${textId}`);
}

// ============================================================================
// TanStack Query Keys
// ============================================================================

export const textKeys = {
  all: ['texts'] as const,
  detail: (roadmapId: number, textId: number) => [...textKeys.all, roadmapId, textId] as const,
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================

/**
 * 개별 텍스트 조회 훅
 */
export function useText(roadmapId: number, textId: number) {
  return useQuery({
    queryKey: textKeys.detail(roadmapId, textId),
    queryFn: () => getText(roadmapId, textId),
    enabled: !!roadmapId && roadmapId > 0 && !!textId && textId > 0,
    staleTime: 10000,
  });
}

/**
 * 텍스트 생성 훅
 */
export function useCreateText(roadmapId: number) {
  return useMutation({
    mutationFn: (data: TextRequest) => createText(roadmapId, data),
  });
}

/**
 * 텍스트 업데이트 훅
 */
export function useUpdateText(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ textId, data }: { textId: number; data: TextUpdateRequest }) =>
      updateText(roadmapId, textId, data),
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: textKeys.detail(roadmapId, variables.textId),
      });
    },
  });
}

/**
 * 텍스트 삭제 훅
 */
export function useDeleteText(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (textId: number) => deleteText(roadmapId, textId),
    onSettled: (_data, _error, textId) => {
      queryClient.invalidateQueries({
        queryKey: textKeys.detail(roadmapId, textId),
      });
    },
  });
}
