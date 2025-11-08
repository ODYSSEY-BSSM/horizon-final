import type { Roadmap } from '@/features/roadmap/types';

export interface Directory {
  id: number;
  name: string;
  parentId: number | null;
  directories: Directory[];
  roadmaps: Roadmap[];
}

export interface TeamDirectory {
  id: number;
  name: string;
  teamId: number;
  roadmaps: Roadmap[];
}

export interface CreateDirectoryRequest {
  name: string;
  parentId?: number | null;
}

export interface UpdateDirectoryRequest {
  name?: string;
  parentId?: number | null;
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export type GetDirectoriesResponse = ApiResponse<Directory[]>;
export type CreateDirectoryResponse = ApiResponse<Directory>;
export type UpdateDirectoryResponse = ApiResponse<Directory>;
export type DeleteDirectoryResponse = ApiResponse<string>;

export type CreateTeamDirectoryResponse = ApiResponse<TeamDirectory>;
export type UpdateTeamDirectoryResponse = ApiResponse<TeamDirectory>;
