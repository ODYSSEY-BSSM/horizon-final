import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSignupFlow } from '@/lib/stores/signupFlow';
import { type UsernameFormData, usernameSchema } from '@/lib/validations/signup';
import { useRegister } from '../useSignUp';

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

      if (errorMessage.includes('이메일')) {
        form.setError('username', {
          type: 'manual',
          message: '이미 가입된 이메일입니다',
        });
      } else if (errorMessage.includes('사용자명')) {
        form.setError('username', {
          type: 'manual',
          message: '이미 사용중인 이름입니다',
        });
      } else {
        form.setError('username', {
          type: 'manual',
          message: '회원가입에 실패했습니다',
        });
      }
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSubmit),
    isLoading: registerMutation.isPending,
  };
};
