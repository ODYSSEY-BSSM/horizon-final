import type { ProblemStatus } from '@/shared/api/types';

export interface ProblemCreateRequest {
  title: string;
  answer: string;
}

export interface ProblemSolveRequest {
  answer: string;
}

export interface ProblemResponse {
  id: number;
  title: string;
  status: ProblemStatus;
}

export interface ProblemListResponse {
  problems: ProblemResponse[];
}
