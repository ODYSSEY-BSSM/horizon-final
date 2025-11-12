import type { ProblemStatus } from '@/shared/api/types';

// ===================================
// Problem API Types (Swagger API)
// ===================================

// Problem Create (문제 생성)
export interface ProblemCreateRequest {
  title: string;
  answer: string; // 정답
}

// Problem Solve (문제 풀이)
export interface ProblemSolveRequest {
  answer: string; // 제출한 답
}

// Problem Response (문제 응답)
export interface ProblemResponse {
  id: number;
  title: string;
  status: ProblemStatus; // UNRESOLVED | RESOLVED
}

// Problem List Response (문제 목록 조회)
export interface ProblemListResponse {
  problems: ProblemResponse[];
}
