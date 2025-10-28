import { useState } from 'react';
import { useSignupFlow } from '@/lib/stores/signupFlow';
import { useSignUpValidation } from './useSignUpValidation';

export const useEmailStep = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { updateCompletedData, setCurrentStep } = useSignupFlow();
  const { validateEmail } = useSignUpValidation();

  const clearError = () => setError('');

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateCompletedData({ email });
      setCurrentStep('verification');
    } catch (_error) {
      setError('이미 가입된 이메일입니다');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail: handleEmailChange,
    isLoading,
    error,
    handleSubmit,
    clearError,
  };
};
