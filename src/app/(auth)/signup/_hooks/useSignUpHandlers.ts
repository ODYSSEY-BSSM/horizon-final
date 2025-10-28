import { useRouter } from 'next/navigation';
import type React from 'react';
import { useSignUpActions, useSignUpStore } from '@/lib/stores/signupStore';
import { useRegister } from './useSignUp';
import { useSignUpValidation } from './useSignUpValidation';

export const useSignUpHandlers = () => {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    currentStep,
    email,
    verificationCode,
    password,
    confirmPassword,
    username,
    isLoading,
    errors,
    signUpData,
  } = useSignUpStore();

  const {
    setIsLoading,
    setErrors,
    clearAllErrors,
    updateSignUpData,
    goToNextStep,
    goToPreviousStep,
  } = useSignUpActions();

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
    clearAllErrors();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateSignUpData({ email });
      goToNextStep();
    } catch (_error) {
      setErrors({ email: '이미 가입된 이메일입니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationCode = async () => {
    setIsLoading(true);
    clearAllErrors();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    clearAllErrors();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateSignUpData({ verificationCode });
      goToNextStep();
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
    clearAllErrors();
    try {
      updateSignUpData({ password, confirmPassword });
      goToNextStep();
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
    clearAllErrors();
    try {
      if (!signUpData.email || !signUpData.password) {
        throw new Error('이메일 또는 비밀번호가 없습니다');
      }

      await registerMutation.mutateAsync({
        email: signUpData.email,
        password: signUpData.password,
        username,
      });

      router.push('/signin');
    } catch (error) {
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
      case 'password':
      case 'username':
        goToPreviousStep();
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
