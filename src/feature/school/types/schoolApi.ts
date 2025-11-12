import type { Subject } from '@/shared/api/types';

// ===================================
// School Connect API Types
// ===================================

// School Connect Request (학교 연동 요청)
export interface SchoolConnectRequest {
  schoolCode: string; // 학교 연동 코드
}

// School Response (학교 정보)
export interface SchoolResponse {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
  connectedAt: string; // ISO 8601 format
}

// Education Node (교육과정 노드)
export interface EducationNodeResponse {
  id: number;
  title: string;
  description?: string;
  subject: Subject;
  teacher?: string; // 교사 이름
  grade?: number; // 학년
  semester?: number; // 학기
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// Education Node List Response (교육과정 노드 목록)
export interface EducationNodeListResponse {
  nodes: EducationNodeResponse[];
}

// School Disconnect Response (학교 연동 해제)
export interface SchoolDisconnectResponse {
  success: boolean;
  message?: string;
}
