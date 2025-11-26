import type { Subject } from '@/shared/api/types';

export interface SchoolConnectRequest {
  schoolCode: string;
}

export interface SchoolResponse {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
  connectedAt: string;
}

export interface EducationNodeResponse {
  id: number;
  title: string;
  description?: string;
  subject: Subject;
  grade?: number;
  semester?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EducationNodeListResponse {
  nodes: EducationNodeResponse[];
}

export interface SchoolDisconnectResponse {
  success: boolean;
  message?: string;
}

// API에서 실제로 반환하는 타입 (progress 필드 포함)
export interface EducationApiResponse {
  id: number;
  title: string;
  description: string;
  progress: number;
}

// UI에서 사용하는 타입 (usageCount 필드 포함)
export interface EducationResponse {
  id: number;
  title: string;
  description?: string;
  usageCount?: number;
}

export interface SubjectInfo {
  subjectName: string;
  description: string;
}

export interface EducationSubjectResponse {
  subjects: SubjectInfo[];
}

export interface EducationCountResponse {
  count: number;
}
