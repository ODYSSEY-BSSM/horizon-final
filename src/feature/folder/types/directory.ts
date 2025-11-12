// ===================================
// Directory API Types (Swagger API)
// ===================================

// Directory Create (디렉토리 생성)
export interface DirectoryCreateRequest {
  name: string; // 0-64자
  parentId?: number; // 부모 디렉토리 ID (선택)
}

// Directory Response (디렉토리 응답) - 재귀 구조
export interface DirectoryResponse {
  id: number;
  name: string;
  parentId?: number;
  directories: DirectoryResponse[]; // 중첩된 하위 디렉토리들
  roadmaps: SimpleRoadmapResponse[]; // 디렉토리 내 로드맵들
}

// Simple Roadmap Response (디렉토리 내 로드맵 간소 정보)
export interface SimpleRoadmapResponse {
  id: number;
  title: string;
}

// Directory Update (디렉토리 수정)
export interface DirectoryUpdateRequest {
  name?: string;
  parentId?: number;
}

// Directory Content Response (루트 컨텐츠 조회)
export interface DirectoryContentResponse {
  directories: DirectoryResponse[];
}

// ===================================
// Team Directory API Types (Swagger API)
// ===================================

// Team Directory - 동일한 구조 사용
export interface TeamDirectoryCreateRequest extends DirectoryCreateRequest {}
export interface TeamDirectoryResponse extends DirectoryResponse {
  teamId: number;
}
export interface TeamDirectoryUpdateRequest extends DirectoryUpdateRequest {}
export interface TeamDirectoryContentResponse extends DirectoryContentResponse {}
