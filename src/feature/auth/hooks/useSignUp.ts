import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/feature/auth';
import type { RegisterRequest } from '@/feature/auth/types/auth';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
};
