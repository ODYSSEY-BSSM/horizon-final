export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}
