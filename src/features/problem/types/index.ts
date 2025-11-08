export type ProblemStatus = 'UNRESOLVED' | 'RESOLVED';

export interface Problem {
  id: number;
  title: string;
  status: ProblemStatus;
}

export interface CreateProblemRequest {
  title: string;
  answer: string;
}

export interface CreateProblemResponse {
  code: string;
  message: string;
  data: Problem;
}

export interface SolveProblemRequest {
  answer: string;
}

export interface SolveProblemResponse {
  code: string;
  message: string;
  data: Problem;
}
