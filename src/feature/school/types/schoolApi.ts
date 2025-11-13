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
  teacher?: string;
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
