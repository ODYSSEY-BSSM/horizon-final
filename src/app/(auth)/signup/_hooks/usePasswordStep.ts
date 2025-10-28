import { useState } from 'react';
import { useSignupFlow } from '@/lib/stores/signupFlow';
import { useSignUpValidation } from './useSignUpValidation';

export const usePasswordStep = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { updateCompletedData, setCurrentStep } = useSignupFlow();
  const { validatePassword, validateConfirmPassword } = useSignUpValidation();

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      clearError('password');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      clearError('confirmPassword');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError || '',
        confirmPassword: confirmPasswordError || '',
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      updateCompletedData({ password, confirmPassword });
      setCurrentStep('username');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword: handlePasswordChange,
    confirmPassword,
    setConfirmPassword: handleConfirmPasswordChange,
    isLoading,
    errors,
    handleSubmit,
    clearError,
  };
};
