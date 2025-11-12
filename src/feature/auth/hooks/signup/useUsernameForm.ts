import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/feature/auth/hooks/useSignUp';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type UsernameFormData, usernameSchema } from '@/feature/auth/validations/signup';

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
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

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
