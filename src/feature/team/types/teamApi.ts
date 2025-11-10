import type { ApplyStatus, UserRole } from '@/shared/api/types';

// ===================================
// Team API Types
// ===================================

// Team Create (팀 생성)
export interface TeamCreateRequest {
  name: string;
  description?: string;
}

// Team Response (팀 응답)
export interface TeamResponse {
  uuid: number;
  name: string;
  description?: string;
  inviteCode: string; // 초대 코드
  memberCount: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// Team Update (팀 수정)
export interface TeamUpdateRequest {
  name?: string;
  description?: string;
}

// Team Member (팀 멤버)
export interface TeamMemberResponse {
  uuid: number;
  username: string;
  email: string;
  role: UserRole;
  joinedAt: string; // ISO 8601 format
}

// Team Members List Response (팀 멤버 목록)
export interface TeamMembersResponse {
  members: TeamMemberResponse[];
}

// ===================================
// Team Apply API Types
// ===================================

// Team Apply Request (팀 신청)
export interface TeamApplyRequest {
  inviteCode: string;
}

// Team Apply Response (팀 신청 응답)
export interface TeamApplyResponse {
  uuid: number;
  teamName: string;
  username: string;
  email: string;
  status: ApplyStatus;
  appliedAt: string; // ISO 8601 format
  processedAt?: string; // ISO 8601 format (수락/거절 시)
}

// Team Apply List Response (팀 신청 목록)
export interface TeamApplyListResponse {
  applications: TeamApplyResponse[];
}

// Team Apply Action Request (팀 신청 수락/거절)
export interface TeamApplyActionRequest {
  status: ApplyStatus.APPROVED | ApplyStatus.REJECTED;
}
