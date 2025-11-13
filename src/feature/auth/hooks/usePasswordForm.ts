import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSignupFlow } from '@/feature/auth/store/signupFlow';
import { type PasswordFormData, passwordSchema } from '@/feature/auth/validations/signup';

export const usePasswordForm = () => {
  const { goToStep, saveStepData } = useSignupFlow();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = (data: PasswordFormData) => {
    saveStepData({
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    goToStep('username');
  };

  const password = form.watch('password');
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSubmit),
    passwordValidation: {
      hasMinLength,
      hasNumber,
      hasSpecialChar,
      isValid: hasMinLength && hasNumber && hasSpecialChar,
    },
  };
};
