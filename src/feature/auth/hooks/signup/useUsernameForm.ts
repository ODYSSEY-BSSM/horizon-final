import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/feature/auth/hooks/useSignUp';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type UsernameFormData, usernameSchema } from '@/feature/auth/validations/signup';
import { ApiError } from '@/shared/api/errors';

export const useUsernameForm = () => {
  const router = useRouter();
  const { completedData } = useSignupFlow();
  const registerMutation = useRegister();

  const form = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const handleSubmit = async (data: UsernameFormData) => {
    try {
      if (!completedData.email || !completedData.password) {
        throw new Error('이메일 또는 비밀번호가 없습니다');
      }

      await registerMutation.mutateAsync({
        email: completedData.email,
        password: completedData.password,
        username: data.username,
      });

      router.push('/signin');
    } catch (error) {
      let errorMessage = '알 수 없는 오류가 발생했습니다';

      if (error instanceof ApiError) {
        // Handle specific API errors
        if (error.isNetworkError() || error.status === 0) {
          errorMessage = '네트워크 연결을 확인해주세요';
        } else if (error.status === 409) {
          errorMessage = '이미 사용 중인 사용자명입니다';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      form.setError('username', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSubmit),
    isLoading: registerMutation.isPending,
  };
};
