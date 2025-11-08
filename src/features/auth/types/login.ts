export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  code: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};
