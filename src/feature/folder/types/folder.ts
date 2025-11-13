export type FolderType = 'personal' | 'team';

export interface FolderCreateRequest {
  name: string;
}

export interface SimpleRoadmapResponse {
  id: number;
  title: string;
  color: string;
  icon: string;
  progress: number;
}

export interface SimpleDirectoryResponse {
  id: number;
  name: string;
  description: string;
  progress: number;
  directories?: SimpleDirectoryResponse[];
  roadmaps?: SimpleRoadmapResponse[];
}

export interface RootContentResponse {
  directories: SimpleDirectoryResponse[];
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
