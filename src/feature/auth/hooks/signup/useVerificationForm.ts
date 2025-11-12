import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { authApi } from '@/feature/auth';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type VerificationFormData, verificationSchema } from '@/feature/auth/validations/signup';
import { ApiError } from '@/shared/api/errors';

export const useVerificationForm = () => {
  const { goToStep, saveStepData, completedData } = useSignupFlow();

  const { mutateAsync: verifyCode } = useMutation({
    mutationFn: (code: string) => {
      if (!completedData.email) {
        throw new Error('이메일 정보가 없습니다.');
      }
      return authApi.verifyCode({ email: completedData.email, code });
    },
  });

  const { mutateAsync: resendCode } = useMutation({
    mutationFn: () => {
      if (!completedData.email) {
        throw new Error('이메일 정보가 없습니다.');
      }
      return authApi.requestVerificationCode({ email: completedData.email });
    },
  });

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    mode: 'onChange',
    defaultValues: {
      verificationCode: '',
    },
  });

  const handleSubmit = async (data: VerificationFormData) => {
    try {
      await verifyCode(data.verificationCode);
      saveStepData({ verificationCode: data.verificationCode });
      goToStep('password');
    } catch (error) {
      let errorMessage = '인증번호가 올바르지 않습니다';

      if (error instanceof ApiError) {
        // Handle specific API errors
        if (error.isNetworkError() || error.status === 0) {
          errorMessage = '네트워크 연결을 확인해주세요';
        } else if (error.status === 400 || error.status === 401) {
          errorMessage = '인증번호가 올바르지 않거나 만료되었습니다';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      form.setError('verificationCode', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  const handleResendCode = async () => {
    try {
      await resendCode();
    } catch (error) {
      let errorMessage = '인증번호 전송에 실패했습니다';

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

      form.setError('verificationCode', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSubmit),
    onResendCode: handleResendCode,
  };
};
