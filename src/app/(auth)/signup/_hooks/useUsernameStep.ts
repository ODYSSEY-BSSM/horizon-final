import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { useSignupFlow } from '@/lib/stores/signupFlow';
import { useRegister } from './useSignUp';
import { useSignUpValidation } from './useSignUpValidation';

export const useUsernameStep = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { completedData } = useSignupFlow();
  const { validateUsername } = useSignUpValidation();
  const registerMutation = useRegister();

  const clearError = () => setError('');

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      if (!completedData.email || !completedData.password) {
        throw new Error('이메일 또는 비밀번호가 없습니다');
      }

      await registerMutation.mutateAsync({
        email: completedData.email,
        password: completedData.password,
        username,
      });

      router.push('/signin');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

      if (errorMessage.includes('이메일')) {
        setError('이미 가입된 이메일입니다');
      } else if (errorMessage.includes('사용자명')) {
        setError('이미 사용중인 이름입니다');
      } else {
        setError('회원가입에 실패했습니다');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername: handleUsernameChange,
    isLoading,
    error,
    handleSubmit,
    clearError,
  };
};
