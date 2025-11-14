export interface DirectoryCreateRequest {
  name: string;
  parentId?: number;
}

export interface DirectoryResponse {
  id: number;
  name: string;
  parentId?: number;
  directories: DirectoryResponse[];
  roadmaps: SimpleRoadmapResponse[];
}

export interface SimpleRoadmapResponse {
  id: number;
  title: string;
  color: string;
  icon: string;
}

export interface DirectoryUpdateRequest {
  name?: string;
  parentId?: number;
}

export interface DirectoryContentResponse {
  directories: DirectoryResponse[];
}

export interface TeamDirectoryCreateRequest extends DirectoryCreateRequest {}
export interface TeamDirectoryResponse extends DirectoryResponse {
  teamId: number;
}
export interface TeamDirectoryUpdateRequest extends DirectoryUpdateRequest {}
export interface TeamDirectoryContentResponse extends DirectoryContentResponse {}
