import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { authApi } from '@/feature/auth/api/authApi';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type VerificationFormData, verificationSchema } from '@/feature/auth/validations/signup';

export const useVerificationForm = () => {
  const { completedData, goToStep, saveStepData } = useSignupFlow();

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    mode: 'onChange',
    defaultValues: {
      verificationCode: '',
    },
  });

  const handleSubmit = async (data: VerificationFormData) => {
    try {
      const devCode = process.env.NEXT_PUBLIC_DEV_VERIFICATION_CODE;

      if (devCode && data.verificationCode === devCode) {
        saveStepData({ verificationCode: data.verificationCode });
        goToStep('password');
        return;
      }

      if (!completedData.email) {
        throw new Error('이메일 정보가 없습니다');
      }

      await authApi.verifyCode({
        email: completedData.email,
        code: data.verificationCode,
      });

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
      if (!completedData.email) {
        throw new Error('이메일 정보가 없습니다');
      }

      await authApi.requestVerificationCode({ email: completedData.email });
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
