export interface DirectoryCreateRequest {
  name: string;
  description?: string;
  parentId?: number;
}

export interface SimpleDirectoryResponse {
  id?: number;
  name?: string;
  description?: string;
  roadmaps?: SimpleRoadmapResponse[];
  roadmapCount?: number;
}

export interface DirectoryResponse {
  id?: number;
  name?: string;
  parentId?: number;
  description?: string;
  directories?: SimpleDirectoryResponse[];
  roadmaps?: SimpleRoadmapResponse[];
  roadmapCount?: number;
}

export interface SimpleRoadmapResponse {
  id?: number;
  title?: string;
}

export interface DirectoryUpdateRequest {
  name?: string;
  parentId?: number;
}

export interface DirectoryContentResponse {
  directories: DirectoryResponse[];
}

export interface TeamDirectoryCreateRequest extends DirectoryCreateRequest {}

export interface TeamDirectoryResponse {
  id?: number;
  name?: string;
  teamId?: number;
  roadmaps?: SimpleRoadmapResponse[];
}

export interface TeamDirectoryUpdateRequest extends DirectoryUpdateRequest {}
export interface TeamDirectoryContentResponse extends DirectoryContentResponse {}
