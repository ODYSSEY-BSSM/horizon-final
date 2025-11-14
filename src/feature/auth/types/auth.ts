export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface VerificationCodeRequest {
  email: string;
}

export interface VerificationRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface PasswordChangeRequest {
  email: string;
  password: string;
}

export interface UpdatePasswordVerifyRequest {
  email: string;
  code: string;
}

export interface DeleteUserRequest {}

export interface UserInfo {
  uuid: number;
  username: string;
  email: string;
}

export interface UserInfoResponse {
  userInfo: UserInfo;
  teams: string[];
  school: string;
  isConnectedSchool: boolean;
}
