import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { authApi } from '@/feature/auth';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type VerificationFormData, verificationSchema } from '@/feature/auth/validations/signup';

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
      const errorMessage = error instanceof Error ? error.message : '인증번호가 올바르지 않습니다';
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
      const errorMessage = error instanceof Error ? error.message : '인증번호 전송에 실패했습니다';
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
