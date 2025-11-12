import type { Color, Icon } from '@/shared/api/types';

// ===================================
// Directory API Types
// ===================================

// Directory Create (디렉토리 생성)
export interface DirectoryCreateRequest {
  name: string;
  color: Color;
  icon: Icon;
  parentUuid?: number; // 부모 디렉토리 UUID (선택)
}

// Directory Response (디렉토리 응답)
export interface DirectoryResponse {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  parentUuid?: number;
  childUuids: number[]; // 자식 디렉토리 UUID 배열
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// Directory Update (디렉토리 수정)
export interface DirectoryUpdateRequest {
  name?: string;
  color?: Color;
  icon?: Icon;
  parentUuid?: number;
}

// Directory Content Response (디렉토리 컨텐츠 조회)
export interface DirectoryContentItem {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  type: 'directory' | 'roadmap'; // 디렉토리 또는 로드맵
  parentUuid?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DirectoryContentResponse {
  items: DirectoryContentItem[];
}

// ===================================
// Team Directory API Types
// ===================================

// Team Directory Create (팀 디렉토리 생성)
export interface TeamDirectoryCreateRequest {
  name: string;
  color: Color;
  icon: Icon;
  parentUuid?: number; // 부모 디렉토리 UUID (선택)
}

// Team Directory Response (팀 디렉토리 응답)
export interface TeamDirectoryResponse {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  parentUuid?: number;
  childUuids: number[]; // 자식 디렉토리 UUID 배열
  teamName: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// Team Directory Update (팀 디렉토리 수정)
export interface TeamDirectoryUpdateRequest {
  name?: string;
  color?: Color;
  icon?: Icon;
  parentUuid?: number;
}

// Team Directory Content Response (팀 디렉토리 컨텐츠 조회)
export interface TeamDirectoryContentItem {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  type: 'directory' | 'roadmap'; // 디렉토리 또는 로드맵
  parentUuid?: number;
  teamName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamDirectoryContentResponse {
  items: TeamDirectoryContentItem[];
}
