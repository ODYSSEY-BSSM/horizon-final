import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type EmailFormData, emailSchema } from '@/feature/auth/validations/signup';

export const useEmailForm = () => {
  const { goToStep, saveStepData } = useSignupFlow();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: EmailFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      saveStepData({ email: data.email });
      goToStep('verification');
    } catch (_error) {
      form.setError('email', {
        type: 'manual',
        message: '이미 가입된 이메일입니다',
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSubmit),
  };
};
