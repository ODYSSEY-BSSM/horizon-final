import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { authApi } from '@/feature/auth';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type EmailFormData, emailSchema } from '@/feature/auth/validations/signup';
import { ApiError } from '@/shared/api/errors';

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
      let errorMessage = '이메일 인증 요청에 실패했습니다';

      if (error instanceof ApiError) {
        // Handle specific API errors
        if (error.isNetworkError() || error.status === 0) {
          errorMessage = '네트워크 연결을 확인해주세요';
        } else if (error.status === 429) {
          errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

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
