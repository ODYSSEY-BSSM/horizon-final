import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { authApi } from '@/feature/auth';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type EmailFormData, emailSchema } from '@/feature/auth/validations/signup';

export const useEmailForm = () => {
  const { goToStep, saveStepData } = useSignupFlow();
  const { mutateAsync: requestVerificationCode } = useMutation({
    mutationFn: (email: string) => authApi.requestVerificationCode({ email }),
  });

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: EmailFormData) => {
    try {
      await requestVerificationCode(data.email);
      saveStepData({ email: data.email });
      goToStep('verification');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '이메일 인증 요청에 실패했습니다';
      form.setError('email', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSubmit),
  };
};
