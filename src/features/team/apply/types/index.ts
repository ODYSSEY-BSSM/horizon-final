export type ApplyStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface TeamApply {
  id: number;
  teamName: string;
  applyStatus: ApplyStatus;
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export type ApplyToTeamResponse = ApiResponse<TeamApply>;
export type ApproveApplicationResponse = ApiResponse<TeamApply>;
export type RejectApplicationResponse = ApiResponse<string>;
