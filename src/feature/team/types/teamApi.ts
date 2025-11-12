// ===================================
// Team API Types (Swagger API)
// ===================================

// Team Create (팀 생성)
export interface TeamCreateRequest {
  name?: string; // 선택 필드
}

// Team Response (팀 응답)
export interface TeamResponse {
  id: number;
  name: string;
  leader: string; // 팀장 이름
  inviteCode: string; // 초대 코드
  members: string[]; // 멤버 이름 목록
}

// Team List Response (팀 목록)
export interface TeamListResponse {
  teams: TeamResponse[];
}

// Team Invite Request (초대 코드로 팀 가입)
export interface TeamInviteRequest {
  inviteCode: string;
}

// Team Update (팀 수정) - Swagger에 명시 안됨, 기본 구조 유지
export interface TeamUpdateRequest {
  name?: string;
}

// 기존 Apply 시스템 제거 - Swagger는 초대 코드 즉시 가입 방식
// TeamApplyRequest, TeamApplyResponse, TeamApplyListResponse, TeamApplyActionRequest 제거됨

// 하위 호환성을 위해 빈 타입으로 남김 (컴파일 에러 방지)
export interface TeamMemberResponse {
  id: number;
  username: string;
  email: string;
}

export interface TeamMembersResponse {
  members: TeamMemberResponse[];
}

export interface TeamApplyRequest {
  inviteCode: string;
}

export interface TeamApplyResponse {
  id: number;
  teamName: string;
}

export interface TeamApplyListResponse {
  applications: TeamApplyResponse[];
}

export interface TeamApplyActionRequest {
  action: string;
}
