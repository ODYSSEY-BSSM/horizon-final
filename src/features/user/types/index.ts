export type VerificationRequest = {
  email: string;
};

export type VerificationConfirmRequest = {
  email: string;
  code: string;
};

export type SignUpRequest = {
  email: string;
  username: string;
  password: string;
};

export type User = {
  uuid: number;
  email: string;
  username: string;
  role: string;
};

export type SignUpResponse = {
  code: string;
  message: string;
  data: User;
};

export type UserInfo = {
  username: string;
  email: string;
  role: string;
  teams: string[];
};

export type GetUserInfoResponse = {
  code: string;
  message: string;
  data: UserInfo;
};

export type UpdatePasswordRequest = {
  password: string;
};
