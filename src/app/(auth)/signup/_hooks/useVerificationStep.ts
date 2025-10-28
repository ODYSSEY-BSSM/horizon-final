import { useState } from 'react';
import { useSignupFlow } from '@/lib/stores/signupFlow';
import { useSignUpValidation } from './useSignUpValidation';

export const useVerificationStep = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { updateCompletedData, setCurrentStep } = useSignupFlow();
  const { validateVerificationCode } = useSignUpValidation();

  const clearError = () => setError('');

  const handleCodeChange = (value: string) => {
    setVerificationCode(value);
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codeError = validateVerificationCode(verificationCode);
    if (codeError) {
      setError(codeError);
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateCompletedData({ verificationCode });
      setCurrentStep('password');
    } catch (_error) {
      setError('인증번호가 올바르지 않습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    clearError();

    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (_error) {
      setError('인증번호 전송에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verificationCode,
    setVerificationCode: handleCodeChange,
    isLoading,
    error,
    handleSubmit,
    handleResendCode,
    clearError,
  };
};
