// ===== Swagger 정의된 타입 =====

export interface TeamCreateRequest {
  name?: string;
}

export interface TeamResponse {
  id?: number;
  name?: string;
  leader?: string;
  inviteCode?: string;
  members?: string[];
}

export interface TeamListResponse {
  teams: string[];
}

export interface TeamInviteRequest {
  inviteCode: string;
}
