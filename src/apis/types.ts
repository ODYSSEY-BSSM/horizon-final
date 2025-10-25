// API Response Types
export interface ApiResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface UserInfoResponse {
  id: string;
  email: string;
  name?: string;
  // Add other user fields as needed
}

// Token Types
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}
