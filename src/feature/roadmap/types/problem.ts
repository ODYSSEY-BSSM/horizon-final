import type { ProblemStatus } from '@/shared/api/types';

// ===================================
// Problem API Types
// ===================================

// Problem Create (문제 생성)
export interface ProblemCreateRequest {
  title: string;
  description: string;
  link?: string; // 문제 링크 (선택)
}

// Problem Response (문제 응답)
export interface ProblemResponse {
  uuid: number;
  title: string;
  description: string;
  link?: string;
  status: ProblemStatus;
  nodeUuid: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  solvedAt?: string; // ISO 8601 format (문제 해결 시)
}

// Problem Solve Request (문제 풀이)
export interface ProblemSolveRequest {
  status: ProblemStatus;
}

// Problem List Response (문제 목록)
export interface ProblemListResponse {
  problems: ProblemResponse[];
}
