import { useMutation } from '@tanstack/react-query';
import type { RegisterRequest } from '@/core/api';
import { userApi } from '@/core/api';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => userApi.register(data),
  });
};
