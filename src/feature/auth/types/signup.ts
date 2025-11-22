export type SignUpStep = 'email' | 'verification' | 'password' | 'username';

export interface SignUpData {
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  username: string;
}
