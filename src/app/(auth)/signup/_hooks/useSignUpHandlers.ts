'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import type { SignUpData, SignUpStep } from '@/core/types';
import { useRegister } from './useSignUp';
import { useSignUpValidation } from './useSignUpValidation';

export const useSignUpHandlers = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>('email');
  const [signUpData, setSignUpData] = useState<Partial<SignUpData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const registerMutation = useRegister();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const {
    validateEmail,
    validateVerificationCode,
    validatePassword,
    validateConfirmPassword,
    validateUsername,
  } = useSignUpValidation();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSignUpData((prev) => ({ ...prev, email }));
      setCurrentStep('verification');
    } catch (_error) {
      setErrors({ email: '이미 가입된 이메일입니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationCode = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      // 실제 인증번호 재전송 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // 성공 시 타이머 리셋은 SecondaryAction 컴포넌트에서 자동으로 처리됨
    } catch (_error) {
      setErrors({ code: '인증번호 전송에 실패했습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeError = validateVerificationCode(verificationCode);
    if (codeError) {
      setErrors({ code: codeError });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSignUpData((prev) => ({ ...prev, verificationCode }));
      setCurrentStep('password');
    } catch (_error) {
      setErrors({ code: '인증번호가 올바르지 않습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      setSignUpData((prev) => ({ ...prev, password, confirmPassword }));
      setCurrentStep('username');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usernameError = validateUsername(username);
    if (usernameError) {
      setErrors({ username: usernameError });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      // 실제 회원가입 API 호출
      if (!signUpData.email || !signUpData.password) {
        throw new Error('이메일 또는 비밀번호가 없습니다');
      }

      await registerMutation.mutateAsync({
        email: signUpData.email,
        password: signUpData.password,
        username,
      });

      // 회원가입 성공 시 로그인 페이지로 이동
      router.push('/signin');
    } catch (error) {
      // console.error('회원가입 실패:', error);

      // API 에러 메시지 처리
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      if (errorMessage.includes('이메일')) {
        setErrors({ email: '이미 가입된 이메일입니다' });
      } else if (errorMessage.includes('사용자명')) {
        setErrors({ username: '이미 사용중인 이름입니다' });
      } else {
        setErrors({ username: '회원가입에 실패했습니다' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Google OAuth 흐름 구현 필요 (window.location.href = '/api/auth/google')
    // router.push('/');
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verification':
        setCurrentStep('email');
        break;
      case 'password':
        setCurrentStep('verification');
        break;
      case 'username':
        setCurrentStep('password');
        break;
      default:
        router.back();
    }
  };

  return {
    currentStep,
    signUpData,
    isLoading,
    errors,
    setErrors,
    email,
    setEmail,
    verificationCode,
    setVerificationCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    handleEmailSubmit,
    handleVerificationSubmit,
    handlePasswordSubmit,
    handleUsernameSubmit,
    handleGoogleSignUp,
    handleSignIn,
    handleBack,
    handleResendVerificationCode,
  };
};
