import type React from 'react';

export type SignUpStep = 'email' | 'verification' | 'password' | 'username';

export interface SignUpData {
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export interface StepProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errors: Record<string, string>;
}

export interface EmailStepProps extends StepProps {
  email: string;
  setEmail: (value: string) => void;
  onGoogleSignUp: () => void;
  onSignIn: () => void;
}

export interface VerificationStepProps extends StepProps {
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  email?: string;
}

export interface PasswordStepProps extends StepProps {
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
}

export interface UsernameStepProps extends StepProps {
  username: string;
  setUsername: (value: string) => void;
}
