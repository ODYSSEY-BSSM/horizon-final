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
  teams: TeamResponse[];
}

export interface TeamInviteRequest {
  inviteCode: string;
}

export interface TeamUpdateRequest {
  name?: string;
}

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
