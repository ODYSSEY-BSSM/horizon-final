import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type VerificationFormData, verificationSchema } from '@/feature/auth/validations/signup';

export const useVerificationForm = () => {
  const { goToStep, saveStepData } = useSignupFlow();

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    mode: 'onChange',
    defaultValues: {
      verificationCode: '',
    },
  });

  const handleSubmit = async (data: VerificationFormData) => {
    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      saveStepData({ verificationCode: data.verificationCode });
      goToStep('password');
    } catch (_error) {
      form.setError('verificationCode', {
        type: 'manual',
        message: '인증번호가 올바르지 않습니다',
      });
    }
  };

  const handleResendCode = async () => {
    try {
      // API call simulation for resending code
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (_error) {
      form.setError('verificationCode', {
        type: 'manual',
        message: '인증번호 전송에 실패했습니다',
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSubmit),
    onResendCode: handleResendCode,
  };
};
