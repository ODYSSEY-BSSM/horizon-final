import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schoolApi } from '../api';
import type { SchoolConnectRequest } from '../types';

// Query Keys
export const schoolKeys = {
  all: ['school'] as const,
  connect: () => [...schoolKeys.all, 'connect'] as const,
  educationNodes: () => [...schoolKeys.all, 'education-nodes'] as const,
  educationNode: (id: number) => [...schoolKeys.educationNodes(), id] as const,
};

// ===================================
// School Connect Queries
// ===================================

/**
 * 학교 연동 정보 조회
 */
export function useConnectedSchool() {
  return useQuery({
    queryKey: schoolKeys.connect(),
    queryFn: () => schoolApi.getConnectedSchool(),
    retry: false, // 연동되지 않은 경우 에러가 발생하므로 재시도하지 않음
  });
}

/**
 * 교육과정 노드 목록 조회
 */
export function useEducationNodes() {
  return useQuery({
    queryKey: schoolKeys.educationNodes(),
    queryFn: () => schoolApi.getEducationNodes(),
  });
}

/**
 * 특정 교육과정 노드 조회
 */
export function useEducationNode(educationUuid: number) {
  return useQuery({
    queryKey: schoolKeys.educationNode(educationUuid),
    queryFn: () => schoolApi.getEducationNode(educationUuid),
    enabled: !!educationUuid,
  });
}

// ===================================
// School Connect Mutations
// ===================================

/**
 * 학교 연동
 */
export function useConnectSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SchoolConnectRequest) => schoolApi.connectSchool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.connect() });
      queryClient.invalidateQueries({ queryKey: schoolKeys.educationNodes() });
    },
  });
}

/**
 * 학교 연동 해제
 */
export function useDisconnectSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => schoolApi.disconnectSchool(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.connect() });
      queryClient.invalidateQueries({ queryKey: schoolKeys.educationNodes() });
    },
  });
}
