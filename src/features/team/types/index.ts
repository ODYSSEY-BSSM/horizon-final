export interface Team {
  id: number;
  name: string;
  leader: string;
  members: string[];
}

export interface CreateTeamRequest {
  name: string;
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export type CreateTeamResponse = ApiResponse<Team>;
export type GetTeamResponse = ApiResponse<Team>;
export type DeleteTeamResponse = ApiResponse<string>;
