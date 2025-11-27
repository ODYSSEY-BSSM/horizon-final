/**
 * Roadmap Editor - Section API Client
 * API functions and TanStack Query hooks for section operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { SectionRequest, SectionResponse, SectionUpdateRequest } from '../types/api.types';

// ============================================================================
// API Client Functions
// ============================================================================

/**
 * 개별 섹션 조회
 * GET /{roadmapId}/section/{sectionId}
 */
export async function getSection(
  roadmapId: number,
  sectionId: number,
): Promise<{ id: number; name: string }> {
  return apiClient.get<{ id: number; name: string }>(`/${roadmapId}/section/${sectionId}`);
}

/**
 * 섹션 생성
 * POST /{roadmapId}/section
 */
export async function createSection(
  roadmapId: number,
  data: SectionRequest,
): Promise<SectionResponse> {
  const response = await apiClient.post<{ section: SectionResponse }>(
    `/${roadmapId}/section`,
    data,
  );
  return response.section;
}

/**
 * 섹션 업데이트
 * PATCH /{roadmapId}/section/{sectionId}
 */
export async function updateSection(
  roadmapId: number,
  sectionId: number,
  data: SectionUpdateRequest,
): Promise<SectionResponse> {
  const response = await apiClient.patch<{ section: SectionResponse }>(
    `/${roadmapId}/section/${sectionId}`,
    data,
  );
  return response.section;
}

/**
 * 섹션 삭제
 * DELETE /{roadmapId}/section/{sectionId}
 */
export async function deleteSection(roadmapId: number, sectionId: number): Promise<void> {
  return apiClient.delete<void>(`/${roadmapId}/section/${sectionId}`);
}

// ============================================================================
// TanStack Query Keys
// ============================================================================

export const sectionKeys = {
  all: ['sections'] as const,
  detail: (roadmapId: number, sectionId: number) =>
    [...sectionKeys.all, roadmapId, sectionId] as const,
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================

/**
 * 개별 섹션 조회 훅
 */
export function useSection(roadmapId: number, sectionId: number) {
  return useQuery({
    queryKey: sectionKeys.detail(roadmapId, sectionId),
    queryFn: () => getSection(roadmapId, sectionId),
    enabled: !!roadmapId && roadmapId > 0 && !!sectionId && sectionId > 0,
    staleTime: 10000,
  });
}

/**
 * 섹션 생성 훅
 */
export function useCreateSection(roadmapId: number) {
  return useMutation({
    mutationFn: (data: SectionRequest) => createSection(roadmapId, data),
  });
}

/**
 * 섹션 업데이트 훅
 */
export function useUpdateSection(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: number; data: SectionUpdateRequest }) =>
      updateSection(roadmapId, sectionId, data),
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: sectionKeys.detail(roadmapId, variables.sectionId),
      });
    },
  });
}

/**
 * 섹션 삭제 훅
 */
export function useDeleteSection(roadmapId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: number) => deleteSection(roadmapId, sectionId),
    onSettled: (_data, _error, sectionId) => {
      queryClient.invalidateQueries({
        queryKey: sectionKeys.detail(roadmapId, sectionId),
      });
    },
  });
}
