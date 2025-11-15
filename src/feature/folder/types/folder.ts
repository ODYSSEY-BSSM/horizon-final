export type FolderType = 'personal' | 'team';

export interface FolderCreateRequest {
  name: string;
}

export interface SimpleRoadmapResponse {
  id?: number;
  title?: string;
}

export interface SimpleDirectoryResponse {
  id?: number;
  name?: string;
}

export interface RootContentResponse {
  directories?: SimpleDirectoryResponse[];
}

export interface Folder {
  id: string;
  name: string;
  type: FolderType;
  createdAt: string;
  updatedAt: string;
  userId: string;
  teamId: string;
  parentId: string | null;
  children: Folder[];
  roadmaps: SimpleRoadmapResponse[];
  directories: SimpleDirectoryResponse[];
}
